# Seat Pre-Reservations

> Written by [Bernie Chen](https://github.com/bcscc), [Kene Ochuba](https://github.com/Keneo1), [Lucas Siegel](https://github.com/lsiegel4), and [Sunny Wang](https://github.com/sunnyywang) for the final project of COMP 423: Foundations of Software Engineering.<br>
> _Last Updated: 12/4/2023_

## Overview

It has been a goal of the CSXL Experience Labs for some time to allow the ability for students to reserve seats in the lab, whether it be for collaboration or simply to access the wide range of tools provided. Now, a portion of the seats will be reservable up to **1 week** in advance, while others will remain available for drop-in use only to ensure a balanced working environment.

With this feature, students will be able to pre-reserve a seat in the XL for a specific time and date up to 1 week in advance. Seats that aren't reserved in the next hour will be available on a drop-in basis. The feature also checks that the XL is open and the seat is not already reserved when the student tries to make a reservation. Furthermore, there will be a cap of 2 upcoming reservations a student can make at a time.

Ideally, the pre-reservation **User Interface** will contain a map of the XL with outlines of the seats available and reserved. However, if this is unattainable, the system will instead assign an ID to each seat, which will be used to show whether the seat is available or reserved.

## Key Personas

**Sandy Student** - Sandy is a CS major who will visit the CS Experience Lab to utilize the resources of the collaboration and productivity space.

**Ashley Ambassador** - Ashley is a student ambassador for the CS Experience Lab who works at the check-in desk, manages student reservations, and welcomes incoming students.

## User Stories

**Sandy Student:**
As Sandy Student, I want to be able to reserve a table with monitor at the XL up to one week in advance, so that I can more efficiently block out time to complete my tasks.

Subtasks:

> 1. Sandy Student will find the available seats and time slots for any chosen day up to one week in advance, as long as the XL is open.<br>
> 2. Sandy Student will see a list of their upcoming reservations.<br>
> 3. Sandy Student will be able to cancel an upcoming reservation.<br>

**Ashley Ambassador:**
As Ashley Ambassador, I want to be able to view upcoming reservations and manage active reservations, so that I can more efficiently manage student reservations.

Subtasks:

> 1. Ashley Ambassador will see a list of upcoming student reservations.<br>
> 2. Ashley Ambassador will be able to cancel an active reservation.<br>

## Seat Pre-reservation Figma Wireframe

![Presreservation wireframe](/docs/images/reservationwireframe.png "Pre-reservation wireframe")

In the first image of the wireframe the user will be able to see what seats are reservable based on the date they select. Once a date is selected the view is split into two tables with one for the sitting desks with monitors and one for the standing desks with monitors and the times that the CSXL is open. When an individual selects a time that block in the table will turn green. Once they have selected their times they will be able to reserve them with the button at the bottom.

In the second image a user can view their upcoming reservations. With each reservation their will be a cancel button, with which a user can cancel their reservation.

## Technical Implementation Opportunities and Planning

1. On the front end, we will depend heavily upon **frontend/src/coworking**, in particular, we will extend upon **frontend/src/coworking/reservation**. On the back end, we will depend on the user entities and roles in **backend/entities** to determine who has the ability to reserve a seat, cancel a reservation, and so on. As a result, we will depend upon the authentication API route in **backend/api/authentication** as well, and will likely need to extend upon the service for reservations in **backend/services/coworking/reservation**.

2. Planned page components include a reservation page. The widgets we will need include a reservation card, available registration slot tables, a date selector, a reserve button, and a cancel button.

3. This project will require that we make use of the models in **backend/models/coworking/reservation** and we will need to implement the models in **backend/models/coworking/availability**.

4. We will depend upon the authentication API route in **backend/api/authentication** and the reservation route in **backend/api/coworking/reservation**, and it's unlikely that we will need to add any new routes.

5. The most obvious security risk is that only the student that created the reservation, or an ambassador who sees that the student did not appear on time, should be able to cancel the reservation, **not** another student. Furthermore, students should not be able to see the names of who has reserved seats at what time, they should only know that another student has made a reservation. However, ambassadors must be able to see which students have made reservations for which seats to ensure that the right person is checking in.
