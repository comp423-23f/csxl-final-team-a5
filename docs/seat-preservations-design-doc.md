=======
# Seat Pre-Reservations
> Written by Bernie Chen, Kene Ochuba, Lucas Siegel, and Sunny Wang for the final project of COMP 423: Foundations of Software Engineering.<br>
> *Fall 2023*

## Overview

It has been a goal of the CSXL Experience Labs for some time to allow the ability for students to reserve seats in the lab, whether it be for collaboration or simply to access the wide range of tools provided. Now, **50%** of the seats will be prereservable up to **1 week** in advance, while others will remain available for drop-in use only to ensure a balanced working environment.

With this feature, students will be able to pre-reserve a seat in the XL for a specific time and date up to 1 week in advance. Seats that aren't reserved in the next hour will be available on a drop-in basis. The feature also checks that the XL is open and the seat is not already reserved when the student tries to make a reservation. Furthermore, there will be a cap on the amount of reservations a student can make at a time.

Ideally, the pre-reservation **User Interface** will contain a map of the XL with outlines of the seats available and reserved. However, if this is unattainable, the system will instead assign an ID to each seat, which will be used to show whether the seat is available or reserved.
