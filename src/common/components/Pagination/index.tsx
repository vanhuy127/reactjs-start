import { memo, useCallback, useMemo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/common/styleUtils';



type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = useCallback(() => {
        const pages: (number | '...')[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) { pages.push(i); }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    }, [currentPage, totalPages]);

    const pages = useMemo(() => getPageNumbers(), [getPageNumbers]);

    const handlePageChange = useCallback(
        (page: number) => {
            if (page !== currentPage) {
                onPageChange(page);
            }
        },
        [onPageChange, currentPage],
    );

    return (
        <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
                {/* Prev */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={cn(
                        'gap-1',
                        'bg-background text-foreground border-border',
                        'hover:bg-muted hover:text-foreground',
                        'disabled:hover:bg-background disabled:opacity-50',
                    )}
                >
                    <ChevronLeft className="size-4" />
                    Trước
                </Button>

                {/* Pages */}
                <div className="flex items-center gap-1">
                    {pages.map((page) =>
                        page === '...' ? (
                            <span key={`ellipsis-${currentPage}`} className="text-muted-foreground px-2 text-sm">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={page}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={cn(
                                    'min-w-9',
                                    currentPage === page
                                        ? 'bg-primary text-primary-foreground hover:bg-primary'
                                        : 'bg-background text-foreground border-border hover:bg-muted border',
                                )}
                            >
                                {page}
                            </Button>
                        ),
                    )}
                </div>

                {/* Next */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={cn(
                        'gap-1',
                        'bg-background text-foreground border-border',
                        'hover:bg-muted hover:text-foreground',
                        'disabled:hover:bg-background disabled:opacity-50',
                    )}
                >
                    Sau
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
};

export default memo(Pagination);
