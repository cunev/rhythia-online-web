import {
  Pagination as Pages,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";

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

  return (
    <Pages>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`?page=${Math.max(currentPage - 1, 1)}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(currentPage + 1, totalPages)}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pages>
  );
}
