#!/usr/bin/env python3
import os
import sys
import openai
from dotenv import load_dotenv


def load_config() -> tuple[str, str]:
    """
    Load environment variables, configure the OpenAI SDK,
    and return (chat_deployment_name, embedding_deployment_name).
    """
    print("Loading environment configuration...")
    load_dotenv()

    required = [
        "OPENAI_API_BASE",
        "OPENAI_API_KEY",
        "CHAT_MODEL_NAME",
        "EMBEDDING_MODEL_NAME",
        "OPENAI_API_VERSION",
    ]
    missing = [var for var in required if not os.getenv(var)]
    if missing:
        print(f"Error: Missing environment variables: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

    base      = os.getenv("OPENAI_API_BASE")
    key       = os.getenv("OPENAI_API_KEY")
    version   = os.getenv("OPENAI_API_VERSION")
    chat_dep  = os.getenv("CHAT_MODEL_NAME")
    embed_dep = os.getenv("EMBEDDING_MODEL_NAME")

    openai.api_type    = "azure"
    openai.api_base    = base
    openai.api_version = version
    openai.api_key     = key

    print(
        f"Configured OpenAI SDK:\n"
        f"  base={openai.api_base}\n"
        f"  version={openai.api_version}\n"
        f"  type={openai.api_type}"
    )
    print(f"Using chat deployment:     '{chat_dep}'")
    print(f"Using embedding deployment: '{embed_dep}'")

    return chat_dep, embed_dep