import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();


http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId")!;
    const blob = await ctx.storage.get(storageId);
    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      });
    }
    return new Response(blob);
  }),
});

http.route({
    path: "/clerk",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      const payloadString = await request.text();
      const headerPayload = request.headers;

      try {
        const result = await ctx.runAction(internal.clerk.fulfill, {
          payload: payloadString,
          headers: {
            "svix-id": headerPayload.get("svix-id")!,
            "svix-timestamp": headerPayload.get("svix-timestamp")!,
            "svix-signature": headerPayload.get("svix-signature")!,
          },
        });

        switch (result.type) {
          case "user.created":
            await ctx.runMutation(internal.users.createUser, {
              tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
              name: `${result.data.first_name} ${result.data.last_name ?? ''}`,
              image : result.data.image_url,
            });
            break;

          case "user.updated":
            await ctx.runMutation(internal.users.updateUser, {
              tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
              name: `${result.data.first_name} ${result.data.last_name ?? ''}`,
              image : result.data.image_url,
            });
            break;

          case "organizationMembership.created":
            await ctx.runMutation(internal.users.addOrgIdToUser, {
              orgId: result.data.organization.id,
              tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
              role: result.data.role === "org:admin" ? "org:admin" : "org:member",
            });
            break;

          case "organizationMembership.updated":
            await ctx.runMutation(internal.users.updateRoleInOrgUser, {
              orgId: result.data.organization.id,
              tokenIdentifier: `https://neat-mako-91.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
              role: result.data.role === "org:admin" ? "org:admin" : "org:member",
            });
            break;
        }

        return new Response(null, {
          status: 200,
        });
      } catch (err) {
        return new Response("Webhook Error", {
          status: 400,
        });
      }
    }),
});


export default http;