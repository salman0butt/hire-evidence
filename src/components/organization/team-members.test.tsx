import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeamMembers } from "./team-members";

const members = [
  { userId: "11111111-1111-4111-8111-111111111111", role: "owner" as const },
  { userId: "22222222-2222-4222-8222-222222222222", role: "recruiter" as const },
];

describe("TeamMembers", () => {
  it("shows members and keeps the owner immutable in the UI", () => {
    render(<TeamMembers members={members} canManage />);

    expect(screen.getByText("Owner")).toBeVisible();
    const roleSelect = screen.getByRole("combobox", { name: /^role$/i });
    expect(roleSelect).toHaveValue("recruiter");
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /remove member/i })).toHaveLength(1);
    expect(screen.queryByRole("option", { name: /^owner$/i })).not.toBeInTheDocument();
  });

  it("renders the team read-only when the viewer cannot manage roles", () => {
    render(<TeamMembers members={members} canManage={false} />);

    expect(screen.getByText("Owner")).toBeVisible();
    expect(screen.getByText("Recruiter")).toBeVisible();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /remove member/i })).not.toBeInTheDocument();
  });
});
