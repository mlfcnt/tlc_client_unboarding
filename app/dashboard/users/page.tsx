"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Page from "../../components/Page";
import {ClerkUser} from "@/app/types/ClerkUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ROLES} from "../../constants/Roles";

export default function Users() {
  const {data, isLoading} = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("/api/users").then((res) => res.json() as Promise<ClerkUser[]>),
  });

  const users = data ?? [];

  return (
    <Page title="Users">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-2">
                      {user.emailAddresses[0]?.emailAddress}
                    </td>
                    <td className="px-4 py-2">
                      <UserRoleDropdown
                        userId={user.id}
                        currentRole={user.publicMetadata?.role}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Page>
  );
}

export const UserRoleDropdown = ({
  userId,
  currentRole,
  readOnly = true,
}: {
  userId: string;
  currentRole?: string;
  readOnly?: boolean;
}) => {
  const queryClient = useQueryClient();
  const {
    mutate: updateUserRole,
    isPending,
    variables,
  } = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: keyof typeof ROLES | "none";
    }) =>
      fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({role}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users"]});
    },
  });
  const optimisticCurrentRole = variables?.role ?? currentRole;

  const handleRoleChange = (role: keyof typeof ROLES | "none") => {
    updateUserRole({
      userId,
      role,
    });
  };

  if (readOnly) {
    return (
      <span className="px-3 py-1 border-2 border-border rounded-base bg-main">
        {currentRole === ROLES.admin
          ? "Admin"
          : currentRole === ROLES.sales
          ? "Sales"
          : "None"}
      </span>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="px-3 py-1 border-2 border-border rounded-base bg-main cursor-pointer"
      >
        {optimisticCurrentRole === ROLES.admin
          ? "Admin"
          : optimisticCurrentRole === ROLES.sales
          ? "Sales"
          : "None"}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleRoleChange(ROLES.admin)}
        >
          {isPending ? "..." : "Admin"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleRoleChange(ROLES.sales)}
        >
          {isPending ? "..." : "Sales"}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleRoleChange("none")}
        >
          {isPending ? "..." : "None"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
