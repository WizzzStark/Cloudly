import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="border-b py-4 bg-gray-50">
      <div className="container mx-auto justify-between items-center flex">
            <div>
                FileDrive
            </div>
            <div className="flex fap-2">
                <OrganizationSwitcher />
                <UserButton />
            </div>
      </div>
    </header>
  );
}