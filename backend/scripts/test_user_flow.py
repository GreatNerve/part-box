#!/usr/bin/env python3
"""Run the full user lifecycle integration test."""

import subprocess
import sys


def main() -> int:
    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "pytest",
            "tests/integration/test_full_user_flow.py",
            "-v",
            "-m",
            "integration",
        ],
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
