"""Reserve API

Reserve routes are used to create, retrieve, and update Reservations."""

import datetime
from fastapi import APIRouter, Depends
from typing import Sequence
from authentication import registered_user
from backend.models.coworking.time_range import TimeRange
from backend.services.coworking.operating_hours import OperatingHoursService
from ..services.coworking.reservation import ReservationService
from ..models.coworking import (
    Seat,
    Reservation,
    ReservationRequest,
    SeatAvailability,
    AvailabilityList,
    OperatingHours,
)

from ..models.user import User
from ..test.services.coworking.seat_data import seats

__authors__ = ["Bernie Chen", "Kene Ochuba", "Lucas Siegel", "Sunny Wang"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

api = APIRouter(prefix="/api/reserve")
openapi_tags = {
    "name": "Reserve",
    "description": "Create, update, delete, and retrieve CSXL Reservations.",
}


# @api.get("", tags=["Reserve"])
# def get_reservations(
#   subject: User = Depends(registered_user),
#   reservation_svc: ReservationService = Depends(),
# ) -> Sequence[Reservation]:
#    """Get the Users current reservations."""
#   return reservation_svc.get_upcoming_reservations_for_user(subject, subject)"""


@api.post("", tags=["Reserve"])
def draft_reservation(
    reservation_request: ReservationRequest,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    """Draft a reservation request."""
    return reservation_svc.draft_reservation(subject, reservation_request)


@api.get("", tags=["Reserve"])
def get_available_seats(
    reservation_svc: ReservationService = Depends(),
    operating_svc: OperatingHoursService = Depends(),
    seats: Sequence[Seat] = seats,
    bounds: TimeRange = TimeRange(
        start=datetime.datetime.now(),
        end=datetime.datetime(10000000000000000000000, 0, 0),
    ),
) -> dict[int, SeatAvailability]:
    """Get the available seats based on the date and time input."""
    operating_hours = operating_svc.schedule(bounds)
    availability = reservation_svc._operating_hours_to_bounded_availability_list(
        operating_hours, bounds
    )
    return reservation_svc._initialize_seat_availability_dict(seats, availability)
