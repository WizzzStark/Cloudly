
import { ConvexError, v } from 'convex/values'
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server'
import { getUser } from './users';

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier:string, orgId:string){
    const user = await getUser(ctx, tokenIdentifier);

    const hasAcces = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    return hasAcces;
}


export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        

        if (!identity){
            throw new ConvexError("You must be logged in to create a file")
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if (!hasAccess){
            throw new ConvexError("You must be a member of the organization to create a file")
        };

        await ctx.db.insert('files', {
            name: args.name,
            orgId: args.orgId,
        })
    }
})

export const getFiles = query({
    args: {orgId: v.string()}, 
    
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();

        if (!identity){
            return [];
        }

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

        if (!hasAccess){
            return [];
        }

        return ctx.db.query("files").withIndex("by_orgId", q => q.eq('orgId', args.orgId)).collect();
    }
})