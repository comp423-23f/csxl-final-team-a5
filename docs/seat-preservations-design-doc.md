# Seat Pre-Reservations
> Written by Bernie Chen, Kene Ochuba, Lucas Siegel, and Sunny Wang for the final project of COMP 423: Foundations of Software Engineering.<br>
> *Fall 2023*

## Overview

It has been a goal of the CSXL Experience Labs for some time to allow the ability for students to reserve seats in the lab, whether it be for collaboration or simply to access the wide range of tools provided. Now, **50%** of the seats will be prereservable up to **1 week** in advance, while others will remain available for drop-in use only to ensure a balanced working environment.

With this feature, students will be able to pre-reserve a seat in the XL for a specific time and date up to 1 week in advance. Seats that aren't reserved in the next hour will be available on a drop-in basis. The feature also checks that the XL is open and the seat is not already reserved when the student tries to make a reservation. Furthermore, there will be a cap on the amount of reservations a student can make at a time.

Ideally, the pre-reservation **User Interface** will contain a map of the XL with outlines of the seats available and reserved. However, if this is unattainable, the system will instead assign an ID to each seat, which will be used to show whether the seat is available or reserved.


## Key Personas

**Sandy Student** - Sandy is a CS major who will visit the CS Experience Lab to utilize the resources of the collaboration and productivity space.

**Ashley Ambassador** - Ashley is a student ambassador for the CS Experience Lab who works at the check-in desk, manages student reservations, and welcomes incoming students.

**Andy Adminstrator** - Andy is an adminstrator for the CS Experience Lab who manages the space and student ambassador.


## User Stories

**Sandy Student:**
As Sandy Student, I want to be able to reserve a table with monitor at the XL up to one week in advance, so that I can more efficiently block out time to complete my tasks. 

Subtasks: 
> 1. Sandy Student will find the available seats and time slots for any chosen day, as long as the XL is open.<br>
> 2. Sandy Student will see a list of their upcoming reservations.<br>
> 3. Sandy Student will be able to cancel an upcoming reservation.<br>

**Ashley Ambassador:**
As Ashley Ambassador, I want to be able to view upcoming reservations and manage active reservations, so that I can more efficiently manage student reservations. 

Subtasks:
> 1. Ashley Ambassador will see a list of upcoming student reservations.<br>
> 2. Ashley Ambassador will be able to cancel an active reservation.<br>

**Andy Adminstrator:**
As Andy Administrator, I want to be able to view the upcoming reservations, so that I can have an idea of the traffic in the coworking space and more efficiently manage student ambassador schedules. 

Subtasks:
> 1. Andy Administrator will see a list of upcoming student reservations.<br>
> 2. Andy Administrator will be able to cancel an active reservation.<br>

## Seat Pre-reservation Figma Wireframe

![Presreservation wireframe](/docs/images/reservationwireframe.png "Pre-reservation wireframe")

In the first image of the wireframe the user will be able to see what seats are reservable based on the date they select. Once a date is selected the view is split into two tables with one for the sitting desks with monitors and one for the standing desks with monitors and the times that the CSXL is open. When an individual selects a time that block in the table will turn green. Once they have selected their times they will be able to reserve them with the button at the bottom.

In the second image a user can view their upcoming reservations. With each reservation their will be a cancel button, with which a user can cancel their reservation.

