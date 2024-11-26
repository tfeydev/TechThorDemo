import logging

def setup_logging():
    """Setup basic logging configuration."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(),  # Logs to console
            logging.FileHandler("app/logs/app.log", mode='a'),  # Logs to a file
        ],
    )
