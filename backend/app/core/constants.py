DEFAULT_CATEGORIES: tuple[tuple[str, int], ...] = (
    ("IC", 10),
    ("Arduino / MCU", 1),
    ("Sensor", 3),
    ("Module", 2),
    ("Wire / cable", 5),
    ("Tool", 1),
    ("Other", 5),
)

DEFAULT_CATEGORY_NAMES: tuple[str, ...] = tuple(name for name, _ in DEFAULT_CATEGORIES)

DEFAULT_LOW_STOCK_THRESHOLD = 5
