"""
AI content generation service.

Uses a deterministic template-based generator when no AI_API_KEY is set.
When an AI key is provided, a real provider can be wired in later.
"""

from typing import Optional
from uuid import uuid4
from datetime import datetime

from app.config import get_settings
from app.models.content import Platform, ContentType, ContentStatus
from app.schemas.content import ContentGenerateRequest, ContentRead


PLATFORM_GUIDANCE = {
    Platform.LINKEDIN: "Professional tone. 1–3 short paragraphs. Soft CTA. No hashtag spam.",
    Platform.X: "Concise. Under 280 characters preferred for single posts. Threads use clear numbering.",
    Platform.FACEBOOK: "Conversational. Can be longer. Encourage comments.",
    Platform.INSTAGRAM: "Visual-first caption. Emojis sparingly. Strong first line. Hashtags at end if used.",
}

TYPE_GUIDANCE = {
    ContentType.SHORT_POST: "Keep it punchy and focused on one idea.",
    ContentType.LONG_FORM: "Develop the idea with context, insight and a takeaway.",
    ContentType.THREAD: "Structure as a numbered thread (1/n, 2/n …).",
    ContentType.EDUCATIONAL: "Teach something concrete. Use clear steps or frameworks.",
    ContentType.OPINION: "Take a clear stance and support it briefly.",
    ContentType.ANNOUNCEMENT: "Lead with the news. Keep secondary details short.",
    ContentType.STORY: "Narrative arc: situation → tension → insight.",
}


class ContentGenerator:
    def __init__(self):
        self.settings = get_settings()

    async def generate(self, req: ContentGenerateRequest) -> ContentRead:
        title = req.trend_title or "Emerging trend"
        context = req.trend_context or "This topic is gaining attention across conversations."

        body = self._template_generate(
            title=title,
            context=context,
            platform=req.platform,
            content_type=req.content_type,
            instructions=req.additional_instructions,
        )

        return ContentRead(
            id=uuid4(),
            user_id=None,
            trend_id=req.trend_id,
            title=f"{title} — {req.platform.value}",
            body=body,
            platform=req.platform,
            content_type=req.content_type,
            status=ContentStatus.DRAFT,
            source_trend_title=title,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            scheduled_at=None,
            published_at=None,
        )

    def _template_generate(
        self,
        title: str,
        context: str,
        platform: Platform,
        content_type: ContentType,
        instructions: Optional[str],
    ) -> str:
        """Fallback generator used when no external AI key is configured.
        Produces readable, platform-aware draft content for demos.
        """
        platform_note = PLATFORM_GUIDANCE.get(platform, "")
        type_note = TYPE_GUIDANCE.get(content_type, "")

        if content_type == ContentType.THREAD and platform == Platform.X:
            return (
                f"1/ {title} is moving fast.\n\n"
                f"2/ {context}\n\n"
                f"3/ Why it matters: teams that engage early build stronger narratives and better products.\n\n"
                f"4/ Practical next step: pick one concrete angle, test it with your audience, and iterate.\n\n"
                f"5/ What are you seeing in your space?"
            )

        if content_type == ContentType.SHORT_POST:
            return (
                f"{title}.\n\n"
                f"{context}\n\n"
                f"Worth watching — and worth creating around. "
                f"What angle would you take?"
            )

        if content_type == ContentType.EDUCATIONAL:
            return (
                f"Quick take on {title}:\n\n"
                f"{context}\n\n"
                f"Three things that help:\n"
                f"1. Clarify the problem your audience already feels.\n"
                f"2. Show one concrete example or framework.\n"
                f"3. End with a question that invites experience, not just agreement.\n\n"
                f"Save this for your next content session."
            )

        if content_type == ContentType.OPINION:
            return (
                f"Hot take: {title} isn’t just hype — it’s a signal.\n\n"
                f"{context}\n\n"
                f"The creators and teams who treat it as a learning opportunity "
                f"(instead of noise) will have the advantage six months from now."
            )

        # Default long-form / announcement style
        extra = f"\n\nNote: {instructions}" if instructions else ""
        return (
            f"{title}\n\n"
            f"{context}\n\n"
            f"For {platform.value} audiences: {platform_note} {type_note}\n\n"
            f"Draft ready for your edit and approval.{extra}"
        )


def get_content_generator() -> ContentGenerator:
    return ContentGenerator()
