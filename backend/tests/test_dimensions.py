from app.services.dimensions import normalize_dimensions


def test_normalizes_feet_to_inches() -> None:
    result = normalize_dimensions("CNC table (4'x8\"): Laguna Smartshop II")
    assert result is not None
    assert result.width_in == 48
    assert result.length_in == 96
    assert result.passes_48x48 is True


def test_normalizes_millimeters_to_inches() -> None:
    result = normalize_dimensions("Work area 1220mm x 2440mm")
    assert result is not None
    assert result.width_in == 48.03
    assert result.length_in == 96.06


def test_does_not_guess_bare_dimensions_without_context() -> None:
    assert normalize_dimensions("The room is 4 x 8") is None

