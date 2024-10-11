import {
  Pagination as Pages,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import { useNavigate } from "react-router-dom";

export default function Pagination({
  currentPage,
  totalItems,
  viewPerPages,
}: {
  currentPage: number;
  totalItems: number;
  viewPerPages: number;
}) {
  const totalPages = Math.ceil(totalItems / viewPerPages);
  const navigate = useNavigate();
  return (
    <Pages>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              const params = new URLSearchParams(document.location.search);
              params.set("page", Math.max(currentPage - 1, 1).toString());
              document.location.search = `?` + params.toString();
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              const params = new URLSearchParams(document.location.search);
              params.set(
                "page",
                Math.min(currentPage + 1, totalPages).toString()
              );
              document.location.search = `?` + params.toString();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pages>
  );
}
