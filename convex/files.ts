import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file");
  }

  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

  if(!user){
    return null;
  }

  const hasAccess =
    user.orgIds.some(item => item.orgId === orgId)|| user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return {user};
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      type: args.type,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favourites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

      const query = args.query;

      if (query) {
        files = files.filter((file) => file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
      }

      if(args.favourites){

        const favourites = await ctx.db.query("favourites")
          .withIndex("by_userId_orgId_fileId", (q) => q.eq("userId", hasAccess.user?._id).eq("orgId", args.orgId))
          .collect();

        files = files.filter((file) => favourites.some((favourite) => favourite.fileId === file._id));
      }

      if(args.deletedOnly){
        files = files.filter((file) => file.shouldDelete);
      } else {
        files = files.filter((file) => !file.shouldDelete);
      }

      return files;

  },
});

export const deleteAllFiles = internalMutation({
  args:{},
  async handler(ctx){ 

    const files = await ctx.db.query("files").withIndex("by_shouldDelete", (q) => q.eq("shouldDelete", true)).collect();

    await Promise.all(files.map(async (file) => {
      await ctx.storage.delete(file.fileId);
      return await ctx.db.delete(file._id);
    }));

  }
});

export const deleteFile = mutation({
  args:{
    fileId: v.id("files"),
  },
  async handler(ctx, args){
    const access = await hasAccesToFile(ctx, args.fileId);

    if (!access){
      throw new ConvexError("you do not have access to ths file");
    }

    const isAdmin = access.user.orgIds.find((item) => item.orgId === access.file.orgId && item.role === "org:admin");

    if (!isAdmin){
      throw new ConvexError("you must be an admin to delete a file");
    }

    await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });

  }
});

export const restoreFile = mutation({
  args:{
    fileId: v.id("files"),
  },
  async handler(ctx, args){
    const access = await hasAccesToFile(ctx, args.fileId);

    if (!access){
      throw new ConvexError("you do not have access to ths file");
    }

    const isAdmin = access.user.orgIds.find((item) => item.orgId === access.file.orgId && item.role === "org:admin");

    if (!isAdmin){
      throw new ConvexError("you must be an admin to delete a file");
    }

    await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });

  }
});

export const toggleFavourite = mutation({
  args:{
    fileId: v.id("files"),
  },
  async handler(ctx, args){
    const access = await hasAccesToFile(ctx, args.fileId);

    if (!access){
      throw new ConvexError("you do not have access to ths file");
    }

    const favourite = await ctx.db.query("favourites")
        .withIndex("by_userId_orgId_fileId", (q) => 
        q.eq("userId", access.user._id).eq("orgId", access.file.orgId).eq("fileId", access.file._id))
        .first();

    if (!favourite){
      await ctx.db.insert("favourites", {
        fileId: access.file._id,
        orgId: access.file.orgId,
        userId: access.user._id,
      });
    } else {
      await ctx.db.delete(favourite._id);
    }

  }
})

export const getAllFavourites = query({
  args:{
    orgId: v.string(),
  },
  async handler(ctx, args){

    const hasAccess = await hasAccessToOrg(ctx,args.orgId);

    if (!hasAccess){
      return [];
    }

    const favourites = await ctx.db.query("favourites")
        .withIndex("by_userId_orgId_fileId", (q) => 
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId))
        .collect();

    return favourites;

  }
})

async function hasAccesToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">){
  const file = await ctx.db.get(fileId);

  if (!file){
    return null;
  }

  const hasAccess = await hasAccessToOrg(
    ctx,
    file.orgId
  );

  if (!hasAccess) {
    return null;
  }

  return {user:hasAccess.user, file};
}