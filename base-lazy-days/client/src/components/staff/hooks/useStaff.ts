import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/react-query/constants";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback((unfilteredStaff: Staff[]) => {
    if(filter === 'all') return unfilteredStaff
    return filterByTreatment(unfilteredStaff, filter)
  }, [filter])

  // TODO: get data from server via useQuery
  const fallback: Staff[] = [];

  const {data: staff = fallback} = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn
  })

  return { staff, filter, setFilter };
}
