import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";

import { createQueryClientWrapper } from "@/test-utils";

test("filter staff", async () => {
  // the magic happens here
  const { result } = renderHook(() => useStaff(), {wrapper: createQueryClientWrapper()})

  await waitFor(() => expect(result.current.staff).toHaveLength(4))

  act(() => result.current.setFilter('facial'))
  await waitFor(() => expect(result.current.staff).toHaveLength(3))
});
