package com.example.movierecommendation.movie.specification;

import com.example.movierecommendation.movie.entity.Movie;
import com.example.movierecommendation.movie.entity.MovieGenre;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class MovieSpecification {

    private MovieSpecification() {
    }

    public static Specification<Movie> withFilters(
            String keyword,
            Long genreId,
            String status,
            Integer movieType
    ) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (StringUtils.hasText(keyword)) {
                predicate = cb.and(predicate,
                        cb.like(cb.lower(root.get("title")),
                                "%" + keyword.toLowerCase() + "%"));
            }

            if (genreId != null) {
                Subquery<Long> subQuery = query.subquery(Long.class);
                Root<MovieGenre> mgRoot = subQuery.from(MovieGenre.class);
                subQuery.select(mgRoot.get("movie").<Long>get("id"))
                        .where(cb.equal(mgRoot.get("genre").get("id"), genreId));
                predicate = cb.and(predicate, root.get("id").in(subQuery));
            }

            if (StringUtils.hasText(status)) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), status));
            }

            if (movieType != null) {
                predicate = cb.and(predicate, cb.equal(root.get("movieType"), movieType));
            }

            return predicate;
        };
    }
}
