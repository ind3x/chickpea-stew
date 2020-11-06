package com.garbando.package.models;

import org.springframework.data.domain.Page;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Paging metadata DTO to control the paging information that is exposed in the API. It accepts a Page object as a constructor
 * parameter and extracts the usable data from it.
 *
 * @param <T> The type of the elements of the content List
 */
public class PageDTO<T>{

    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int pageNumber;
    private int numberOfElements;

    public PageDTO(@NotNull Page<T> entityPage) {
        this.content = entityPage.getContent();
        this.totalElements = entityPage.getTotalElements();
        this.totalPages = entityPage.getTotalPages();
        this.size = entityPage.getSize();
        this.pageNumber = entityPage.getNumber();
        this.numberOfElements = entityPage.getNumberOfElements();
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getNumberOfElements() {
        return numberOfElements;
    }

    public void setNumberOfElements(int numberOfElements) {
        this.numberOfElements = numberOfElements;
    }
}
