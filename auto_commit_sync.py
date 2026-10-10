#!/usr/bin/env python3
"""
auto_commit_sync.py
-------------------
Autonomous hourly synchronization daemon for Fin.D repository.
Performs periodic documentation heartbeat touches (adding/toggling spacing/newlines
or telemetry sync stamps) and executes git commit & push to remote main every hour.

Usage:
  python auto_commit_sync.py                     # Runs continuously every 1 hour (3600s)
  python auto_commit_sync.py --interval 1800     # Runs continuously every 30 minutes
  python auto_commit_sync.py --run-once          # Executes one sync cycle and exits
"""

import os
import sys
import time
import subprocess
import argparse
from datetime import datetime
from pathlib import Path

# Path to the telemetry sync file
DEFAULT_DOC_FILE = Path(__file__).resolve().parent / "docs" / "TELEMETRY_SYNC.md"
DEFAULT_INTERVAL_SECONDS = 3600  # 1 hour

def log(message: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] [AutoCommitSync] {message}", flush=True)

def run_git_command(args: list[str]) -> tuple[int, str, str]:
    """Execute a git command in the repository root directory."""
    repo_root = Path(__file__).resolve().parent
    try:
        proc = subprocess.run(
            ["git"] + args,
            cwd=str(repo_root),
            capture_output=True,
            text=True,
            check=False
        )
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except Exception as e:
        return 1, "", str(e)

def perform_doc_heartbeat(target_file: Path) -> bool:
    """
    Perform a simple document edit:
    Toggles a trailing space, newline, or updates the sync telemetry record.
    """
    target_file.parent.mkdir(parents=True, exist_ok=True)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    if not target_file.exists():
        initial_content = (
            "# Fin.D Telemetry & Repository Synchronization Log\n\n"
            "Autonomous causal engine telemetry state tracking and periodic synchronization heartbeat.\n\n"
            "## Engine Status\n"
            f"- Status: Active\n"
            f"- Last Synchronized: {now_str}\n"
        )
        target_file.write_text(initial_content, encoding="utf-8")
        log(f"Initialized telemetry file: {target_file.name}")
        return True

    content = target_file.read_text(encoding="utf-8")
    
    # Toggle trailing whitespace / newline as requested
    if content.endswith("\n\n"):
        new_content = content[:-1]
    elif content.endswith("\n "):
        new_content = content[:-1] + "\n"
    elif content.endswith("\n"):
        new_content = content + " "
    else:
        new_content = content + "\n"

    # Also update or append the sync record line if present
    lines = new_content.splitlines(keepends=True)
    updated_lines = []
    found_sync = False
    for line in lines:
        if line.startswith("- Last Synchronized:"):
            updated_lines.append(f"- Last Synchronized: {now_str}\n")
            found_sync = True
        else:
            updated_lines.append(line)

    if not found_sync:
        updated_lines.append(f"- Last Synchronized: {now_str}\n")

    final_content = "".join(updated_lines)
    target_file.write_text(final_content, encoding="utf-8")
    log(f"Applied document heartbeat edit to {target_file.name} (updated timestamp & spacing)")
    return True

def sync_repository(commit_all: bool = False) -> bool:
    """Stage changes, commit with clean institutional message, and push to origin main."""
    target_file = DEFAULT_DOC_FILE
    perform_doc_heartbeat(target_file)

    # 1. Stage the file (or all modified files if commit_all is set)
    if commit_all:
        code, out, err = run_git_command(["add", "."])
    else:
        code, out, err = run_git_command(["add", str(target_file.relative_to(Path(__file__).resolve().parent))])

    if code != 0:
        log(f"Git add failed: {err}")
        return False

    # 2. Check if there are changes staged
    code, status_out, err = run_git_command(["status", "--porcelain"])
    if code != 0:
        log(f"Git status failed: {err}")
        return False

    if not status_out.strip():
        log("No changes detected to commit.")
        return True

    # 3. Commit with clean institutional message
    now_tag = datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_msg = f"chore: periodic telemetry sync and documentation heartbeat [{now_tag}]"
    code, out, err = run_git_command(["commit", "-m", commit_msg])
    if code != 0:
        log(f"Git commit failed: {err}")
        return False
    log(f"Committed successfully: {commit_msg}")

    # 4. Push to remote origin main
    log("Pushing commit to origin main...")
    code, push_out, push_err = run_git_command(["push", "origin", "main"])
    if code != 0:
        log(f"Git push warning: {push_err or push_out}")
        return False
    
    log("Successfully pushed latest changes to origin main!")
    return True

def main():
    parser = argparse.ArgumentParser(description="Autonomous hourly git commit & push sync daemon.")
    parser.add_argument(
        "--interval",
        type=int,
        default=DEFAULT_INTERVAL_SECONDS,
        help="Interval in seconds between syncs (default: 3600 seconds = 1 hour)"
    )
    parser.add_argument(
        "--run-once",
        action="store_true",
        help="Execute one sync iteration and immediately exit"
    )
    parser.add_argument(
        "--commit-all",
        action="store_true",
        help="Stage and commit all modified files in repository, not just doc heartbeat"
    )

    args = parser.parse_args()

    log(f"Fin.D Autonomous Commit Daemon started (Interval: {args.interval}s / {args.interval / 60:.1f} minutes).")
    
    if args.run_once:
        success = sync_repository(commit_all=args.commit_all)
        sys.exit(0 if success else 1)

    # Continuous hourly loop
    iteration = 1
    while True:
        try:
            log(f"=== Starting sync cycle #{iteration} ===")
            sync_repository(commit_all=args.commit_all)
            iteration += 1
            log(f"Sleeping for {args.interval}s until next sync cycle...")
            time.sleep(args.interval)
        except KeyboardInterrupt:
            log("Daemon terminated by user.")
            break
        except Exception as ex:
            log(f"Unexpected error in sync cycle: {ex}. Retrying in {args.interval}s...")
            time.sleep(args.interval)

if __name__ == "__main__":
    main()
