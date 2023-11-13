"""ReservationService#get_upcoming_reservations_for_user tests."""

from unittest.mock import create_autospec

from .....services.coworking import ReservationService

# Imported fixtures provide dependencies injected for the tests as parameters.
# Dependent fixtures (seat_svc) are required to be imported in the testing module.
from ..fixtures import (
    reservation_svc,
    permission_svc,
    seat_svc,
    policy_svc,
    operating_hours_svc,
)
from ..time import *

# Import the setup_teardown fixture explicitly to load entities in database.
# The order in which these fixtures run is dependent on their imported alias.
# Since there are relationship dependencies between the entities, order matters.
from ...core_data import setup_insert_data_fixture as insert_order_0
from ..operating_hours_data import fake_data_fixture as insert_order_1
from ..room_data import fake_data_fixture as insert_order_2
from ..seat_data import fake_data_fixture as insert_order_3
from .reservation_data import fake_data_fixture as insert_order_4

# Import the fake model data in a namespace for test assertions
from ...core_data import user_data
from .. import seat_data
from . import reservation_data

__authors__ = ["Bernie Chen, Kene Ochuba, Lucas Siegel, Sunny Wang"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


""" We will need to add more tests, but right now lets check with Kris if we're allowed to change the dummy
    data since we can't really change anything there right now as it will mess with his other tests for 
    get_current_reservations_for_user. For now, the tests ensure that the function runs properly given 
    the current dummy data, and since the function is so similar to get_current the tests are mostly the same."""


def test_get_upcoming_reservations_for_user_as_user(
    reservation_svc: ReservationService,
):
    """Get upcoming reservations for each user _as the user themself_."""
    reservations = reservation_svc.get_upcoming_reservations_for_user(
        user_data.user, user_data.user
    )
    assert len(reservations) == 2
    assert reservations[0].id == reservation_data.reservation_1.id
    assert reservations[1].id == reservation_data.reservation_5.id

    reservations = reservation_svc.get_upcoming_reservations_for_user(
        user_data.ambassador, user_data.ambassador
    )
    assert len(reservations) == 1

    reservations = reservation_svc.get_upcoming_reservations_for_user(
        user_data.root, user_data.root
    )
    assert len(reservations) == 1


def test_get_upcoming_reservations_for_user_permissions(
    reservation_svc: ReservationService,
):
    reservation_svc._permission_svc = create_autospec(reservation_svc._permission_svc)
    reservation_svc.get_upcoming_reservations_for_user(user_data.root, user_data.user)
    reservation_svc._permission_svc.enforce.assert_called_with(
        user_data.root,
        "coworking.reservation.read",
        f"user/{user_data.user.id}",
    )
