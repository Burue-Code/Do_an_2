package com.example.movierecommendation.movie.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateActorRequest {

    @Size(max = 200)
    private String fullName;

    @Size(max = 20)
    private String gender;

    private LocalDate birthDate;

    @Size(max = 100)
    private String nationality;

    private String biography;

    @Size(max = 500)
    private String imageUrl;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
