import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Dimensions:
    """A normalized two-dimensional machine work area."""

    width_in: float
    length_in: float
    unit_unclear: bool = False

    @property
    def passes_48x48(self) -> bool:
        return min(self.width_in, self.length_in) >= 48


PATTERNS = (
    (
        re.compile(
            r"(\d+(?:\.\d+)?)\s*['’]\s*[x×]\s*(\d+(?:\.\d+)?)\s*['’\"”]"
        ),
        12,
    ),
    (re.compile(r'(\d+(?:\.\d+)?)\s*["”]\s*[x×]\s*(\d+(?:\.\d+)?)\s*["”]'), 1),
    (
        re.compile(
            r"(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)\s*[x×]\s*"
            r"(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)",
            re.IGNORECASE,
        ),
        12,
    ),
    (
        re.compile(
            r"(\d+(?:\.\d+)?)\s*mm\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm",
            re.IGNORECASE,
        ),
        1 / 25.4,
    ),
    (
        re.compile(
            r"(\d+(?:\.\d+)?)\s*(?:in|inches)\s*[x×]\s*"
            r"(\d+(?:\.\d+)?)\s*(?:in|inches)",
            re.IGNORECASE,
        ),
        1,
    ),
)


def normalize_dimensions(text: str) -> Dimensions | None:
    """Read common machine-size formats and convert the result to inches."""

    for pattern, multiplier in PATTERNS:
        match = pattern.search(text)
        if match:
            width, length = (float(value) * multiplier for value in match.groups())
            return Dimensions(round(width, 2), round(length, 2))

    # Bare "4 x 8" is only interpreted as feet when the nearby words establish
    # that this is a CNC router or a sheet-goods work area.
    context_is_clear = bool(
        re.search(r"(cnc\s+router|cnc\s+table|sheet\s+goods)", text, re.IGNORECASE)
    )
    bare_match = re.search(r"\b(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\b", text)
    if bare_match and context_is_clear:
        width, length = (float(value) * 12 for value in bare_match.groups())
        return Dimensions(width, length)

    return None
