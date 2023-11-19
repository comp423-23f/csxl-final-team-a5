"""Reserve API

Reserve routes are used to create, retrieve, and update Reservations."""

from datetime import datetime
from fastapi import APIRouter, Depends
from typing import Sequence

from backend.services.coworking.seat import SeatService
from ..api.authentication import registered_user
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


@api.post("", tags=["Reserve"])
def draft_reservation(
    reservation_request: ReservationRequest,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    """Draft a reservation request."""
    return reservation_svc.draft_reservation(subject, reservation_request)


@api.get("/availability", tags=["Reserve"])
def get_available_seats(
    start: datetime,
    end: datetime,
    reservation_svc: ReservationService = Depends(),
    seat_svc: SeatService = Depends(),
) -> Sequence[SeatAvailability]:
    """Get the available seats based on the date and time input."""
    availability_request = TimeRange(start=start, end=end)
    seats = seat_svc.list()
    return reservation_svc.seat_availability(seats, availability_request)


@api.get("/upcoming", tags=["Reserve"])
def get_reservations(
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Sequence[Reservation]:
    """Get the Users current reservations."""
    return reservation_svc.get_upcoming_reservations_for_user(subject, subject)
