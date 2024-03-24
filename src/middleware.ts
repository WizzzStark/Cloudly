import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes : ["/landing"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};