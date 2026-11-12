"""
Trend data provider abstraction.

The application depends on TrendProvider, not on any concrete source.
Swap MockTrendProvider for a real implementation later without changing
route handlers or services that consume trends.
"""

from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timedelta
import random

from app.schemas.trend import TrendRead, TrendDetail, TrendAnalysisRead, TrendListResponse


class TrendProvider(ABC):
    @abstractmethod
    async def list_trends(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
        sort: str = "momentum",
    ) -> TrendListResponse:
        ...

    @abstractmethod
    async def get_trend(self, trend_id: UUID) -> Optional[TrendDetail]:
        ...

    @abstractmethod
    async def analyse_trend(self, trend_id: UUID) -> Optional[TrendAnalysisRead]:
        ...


# ---------------------------------------------------------------------------
# Development / demo data (clearly marked as mock)
# ---------------------------------------------------------------------------

_MOCK_TRENDS: list[dict] = [
    {
        "id": uuid4(),
        "title": "AI Agents Are the Next Big Thing",
        "description": "Autonomous AI agents are moving from demos into real workflows across software, support and knowledge work.",
        "category": "AI",
        "momentum": 94,
        "growth_pct": 247.0,
        "opportunity_score": 91,
        "why_it_matters": "Teams that learn to orchestrate agents early will ship faster and reduce repetitive work. Content around practical agent use-cases is highly shareable right now.",
        "related_topics": ["Agentic AI", "LLM Tools", "Automation", "OpenAI", "LangChain"],
        "sources": [
            {"name": "Industry reports", "url": None},
            {"name": "Developer discussions", "url": None},
        ],
        "image_url": None,
        "is_featured": True,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=1),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "iPhone 17 Leaks and Expectations",
        "description": "Rumours around design changes, camera upgrades and AI features for the next iPhone cycle.",
        "category": "Technology",
        "momentum": 82,
        "growth_pct": 189.0,
        "opportunity_score": 78,
        "why_it_matters": "High volume of speculative content. Brands and creators can ride the hype with thoughtful analysis rather than pure rumour-mongering.",
        "related_topics": ["Apple", "Smartphones", "Mobile AI"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=2),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Climate Tech Funding Rebound",
        "description": "Early-stage climate technology startups are seeing renewed investor interest after a quieter period.",
        "category": "Science",
        "momentum": 76,
        "growth_pct": 162.0,
        "opportunity_score": 84,
        "why_it_matters": "Sustainability-minded audiences and B2B buyers are actively looking for credible climate solutions. Strong narrative potential.",
        "related_topics": ["Cleantech", "ESG", "Green Energy"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": True,
        "created_at": datetime.utcnow() - timedelta(days=3),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Creator Economy Platforms Shift to Ownership",
        "description": "Creators are prioritising platforms and tools that give them more ownership of audience and revenue.",
        "category": "Creator Economy",
        "momentum": 71,
        "growth_pct": 98.0,
        "opportunity_score": 80,
        "why_it_matters": "Direct relevance to any creator-facing product. Opportunity for educational and opinion content.",
        "related_topics": ["Substack", "Newsletter", "Monetization", "Community"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=4),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Remote Work Tools Consolidation",
        "description": "Companies are reducing the number of collaboration tools and consolidating on fewer platforms.",
        "category": "Business",
        "momentum": 68,
        "growth_pct": 55.0,
        "opportunity_score": 72,
        "why_it_matters": "B2B SaaS and productivity content performs well when tied to cost-saving and focus narratives.",
        "related_topics": ["SaaS", "Productivity", "Hybrid Work"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=5),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Sports Betting Regulation Updates",
        "description": "New state-level frameworks are changing how sports betting platforms operate and market.",
        "category": "Sports",
        "momentum": 64,
        "growth_pct": 120.0,
        "opportunity_score": 65,
        "why_it_matters": "High engagement category; compliance-aware content stands out.",
        "related_topics": ["Betting", "Regulation", "Sports Media"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=2),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Personal Finance Apps for Gen Z",
        "description": "Younger audiences are adopting mobile-first money tools at record rates.",
        "category": "Finance",
        "momentum": 79,
        "growth_pct": 145.0,
        "opportunity_score": 83,
        "why_it_matters": "Strong fit for educational short-form and carousel content.",
        "related_topics": ["Fintech", "Budgeting", "Investing"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=1),
        "updated_at": datetime.utcnow(),
    },
    {
        "id": uuid4(),
        "title": "Wellness Micro-Habits Trend",
        "description": "Short, repeatable wellness practices are dominating lifestyle content feeds.",
        "category": "Lifestyle",
        "momentum": 73,
        "growth_pct": 88.0,
        "opportunity_score": 77,
        "why_it_matters": "Highly visual and shareable; good for Stories and Reels-style formats.",
        "related_topics": ["Health", "Habits", "Mindfulness"],
        "sources": [],
        "image_url": None,
        "is_featured": False,
        "is_saved": False,
        "created_at": datetime.utcnow() - timedelta(days=3),
        "updated_at": datetime.utcnow(),
    },
]


def _to_trend_read(raw: dict) -> TrendRead:
    return TrendRead(
        id=raw["id"],
        title=raw["title"],
        description=raw.get("description"),
        category=raw["category"],
        momentum=raw["momentum"],
        growth_pct=raw["growth_pct"],
        opportunity_score=raw["opportunity_score"],
        why_it_matters=raw.get("why_it_matters"),
        related_topics=raw.get("related_topics", []),
        sources=raw.get("sources", []),
        image_url=raw.get("image_url"),
        is_featured=raw.get("is_featured", False),
        is_saved=raw.get("is_saved", False),
        created_at=raw["created_at"],
        updated_at=raw["updated_at"],
    )


class MockTrendProvider(TrendProvider):
    """In-memory mock used for development and demos.
    Clearly not production data.
    """

    async def list_trends(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
        sort: str = "momentum",
    ) -> TrendListResponse:
        items = list(_MOCK_TRENDS)

        if category and category.lower() != "all":
            items = [t for t in items if t["category"].lower() == category.lower()]

        if search:
            q = search.lower()
            items = [
                t
                for t in items
                if q in t["title"].lower()
                or q in (t.get("description") or "").lower()
                or any(q in rt.lower() for rt in t.get("related_topics", []))
            ]

        reverse = True
        key = "momentum"
        if sort == "growth":
            key = "growth_pct"
        elif sort == "opportunity":
            key = "opportunity_score"
        elif sort == "newest":
            key = "created_at"

        items.sort(key=lambda t: t[key], reverse=reverse)

        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size
        page_items = items[start:end]

        return TrendListResponse(
            items=[_to_trend_read(t) for t in page_items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def get_trend(self, trend_id: UUID) -> Optional[TrendDetail]:
        raw = next((t for t in _MOCK_TRENDS if t["id"] == trend_id), None)
        if not raw:
            return None

        base = _to_trend_read(raw)
        analysis = await self.analyse_trend(trend_id)
        return TrendDetail(**base.model_dump(), analysis=analysis)

    async def analyse_trend(self, trend_id: UUID) -> Optional[TrendAnalysisRead]:
        raw = next((t for t in _MOCK_TRENDS if t["id"] == trend_id), None)
        if not raw:
            return None

        # Internal Tendrixa indicators (not scientifically validated measurements)
        score = min(100, int(raw["momentum"] * 0.6 + raw["opportunity_score"] * 0.4))
        return TrendAnalysisRead(
            id=uuid4(),
            trend_id=trend_id,
            trend_score=score,
            momentum=raw["momentum"],
            audience_fit=random.randint(70, 92),
            content_potential=min(100, raw["opportunity_score"] + random.randint(-5, 8)),
            summary=raw.get("why_it_matters")
            or "This topic is showing sustained interest across conversations and media.",
            audience_insights=(
                "Primary audience appears to be professionals and early adopters "
                "who follow technology and productivity trends."
            ),
            content_opportunities=[
                "Practical how-to or playbook post",
                "Opinion / take on what it means for teams",
                "Short educational thread or carousel",
                "Case-study style announcement",
            ],
            created_at=datetime.utcnow(),
        )


class RealTrendProvider(TrendProvider):
    """Placeholder for a future real trend data source."""

    async def list_trends(self, *args, **kwargs) -> TrendListResponse:
        raise NotImplementedError(
            "RealTrendProvider is not configured. "
            "Use MockTrendProvider for development."
        )

    async def get_trend(self, trend_id: UUID) -> Optional[TrendDetail]:
        raise NotImplementedError("RealTrendProvider is not configured.")

    async def analyse_trend(self, trend_id: UUID) -> Optional[TrendAnalysisRead]:
        raise NotImplementedError("RealTrendProvider is not configured.")


def get_trend_provider() -> TrendProvider:
    # In the future, switch based on settings / feature flags
    return MockTrendProvider()
