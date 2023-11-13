# Retrieve Future Availability

> Written by Bernie Chen, Kene Ochuba, Lucas Siegel, and Sunny Wang for the final project of COMP 423: Foundations of Software Engineering.<br>
> Last Updated: 11/12/2023

## New Route

We added a new **/api/coworking/status/reserve** route in the backend API that calls a new **get_coworking_status_reserve** method in the backend service in coworking, which takes in a specified date to retrieve the status of the available seat. This status is returned to the original **pollStatus** function that is called in the frontend reserve service, which is responsible for populating the selectable seat reservation options.

## Database/Entity-level Representation

We use the same data representations already implemented for coworking drop-ins for future reservations.

## Technical and User Experience Design Choice

We prioritized maintaining the consistency between the Coworking and Reserve tabs. We wanted the user to be able to see their upcoming reservations when they first visit the XL website, hence the card appearing in the Coworking tab. But we also decided to include it in the Reserve tab so the user could have a comprehensive, one-stop shop for all things Reservation-related. _So, we chose to display that "Upcoming Reservations" card in both tabs instead of just the "Coworking Tab."_ _We also decided to allow the users to select both the date and time before confirming to display their options instead of showing all options once they only select the date._ This was to limit the amount of information we would need to fetch and display, making the interface cleaner and giving the user exactly what they are looking for, limiting unnecessary options.

## Development Concerns

For future development, user experience improvements can be augmented through additions to the reserve-page component and reserve service. _The reserve service polls the status of the selected date retrieved by the reservation-card widget in the reserve component._ In this way, additions to the way future seat availability can be made can allow users to select specific seats.
