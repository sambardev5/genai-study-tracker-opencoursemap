insert into public.topics (id, slug, name, description)
values
  ('00000000-0000-0000-0000-000000000101', 'llm', 'LLM', 'Large language model foundations and applied workflows.'),
  ('00000000-0000-0000-0000-000000000102', 'slm', 'SLM', 'Small language model design and deployment.'),
  ('00000000-0000-0000-0000-000000000103', 'mcp', 'MCP', 'Model Context Protocol and tool integration.'),
  ('00000000-0000-0000-0000-000000000104', 'generative-ai', 'Generative AI', 'Core generative AI ecosystem and use cases.'),
  ('00000000-0000-0000-0000-000000000105', 'machine-learning', 'Machine Learning', 'Classical ML concepts and workflows.'),
  ('00000000-0000-0000-0000-000000000106', 'prompt-engineering', 'Prompt Engineering', 'Prompt design, evaluation, and guardrails.'),
  ('00000000-0000-0000-0000-000000000107', 'rag', 'RAG', 'Retrieval-augmented generation systems.'),
  ('00000000-0000-0000-0000-000000000108', 'vector-databases', 'Vector Databases', 'Embeddings, indexing, and retrieval infrastructure.'),
  ('00000000-0000-0000-0000-000000000109', 'ai-agents', 'AI Agents', 'Agent planning, tool use, and orchestration.'),
  ('00000000-0000-0000-0000-000000000110', 'fine-tuning', 'Fine-Tuning', 'Model adaptation and optimization workflows.'),
  ('00000000-0000-0000-0000-000000000111', 'evaluation', 'Evaluation', 'Evaluation methods for AI systems.'),
  ('00000000-0000-0000-0000-000000000112', 'mlops', 'MLOps', 'Production operations for ML and AI systems.'),
  ('00000000-0000-0000-0000-000000000113', 'responsible-ai', 'Responsible AI', 'Safety, policy, and governance.'),
  ('00000000-0000-0000-0000-000000000114', 'python-foundations', 'Python Foundations', 'Python basics for AI practitioners.'),
  ('00000000-0000-0000-0000-000000000115', 'statistics', 'Statistics', 'Statistics and experimentation fundamentals.')
on conflict (id) do nothing;

insert into public.providers (id, name, website_url, provider_type)
values
  ('10000000-0000-0000-0000-000000000001', 'Coursera', 'https://www.coursera.org', 'mooc'),
  ('10000000-0000-0000-0000-000000000002', 'DeepLearning.AI', 'https://www.deeplearning.ai', 'community'),
  ('10000000-0000-0000-0000-000000000003', 'Hugging Face', 'https://huggingface.co', 'community')
on conflict (id) do nothing;

insert into public.skill_definitions (id, slug, name, description, topic_id, level_hint)
values
  ('20000000-0000-0000-0000-000000000001', 'rag-architecture', 'RAG architecture', 'Design retrieval, ranking, and grounding flows.', '00000000-0000-0000-0000-000000000107', 'amateur'),
  ('20000000-0000-0000-0000-000000000002', 'prompt-evals', 'Prompt evaluation', 'Design prompt regression and eval suites.', '00000000-0000-0000-0000-000000000106', 'amateur'),
  ('20000000-0000-0000-0000-000000000003', 'model-selection', 'Model selection', 'Choose between LLM, SLM, and platform tradeoffs.', '00000000-0000-0000-0000-000000000101', 'basic'),
  ('20000000-0000-0000-0000-000000000004', 'agent-tooling', 'Agent tooling', 'Integrate tools, memory, and control loops.', '00000000-0000-0000-0000-000000000109', 'professional'),
  ('20000000-0000-0000-0000-000000000005', 'safety-review', 'Safety review', 'Assess production risks and mitigations.', '00000000-0000-0000-0000-000000000113', 'professional')
on conflict (id) do nothing;

insert into public.sources (id, name, base_url, source_type, parser_key, cadence, terms_reviewed, robots_reviewed)
values
  ('30000000-0000-0000-0000-000000000001', 'Manual curation', 'https://opencoursemap.dev/manual', 'manual', 'manualAdapter', 'ad-hoc', true, true),
  ('30000000-0000-0000-0000-000000000002', 'Provider RSS', 'https://example.com/feed.xml', 'rss', 'rssAdapter', 'daily', true, true)
on conflict (id) do nothing;

insert into public.resources (id, provider_id, source_id, canonical_url, title, summary, language_code, difficulty, duration_hours, is_free, free_verification_status, free_verified_at, is_active, published_at)
values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/llm-foundations', 'LLM Foundations for Builders', 'Modern large language model systems for builders.', 'en', 'basic', 5, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://opencoursemap.dev/demo/practical-rag', 'Practical RAG Systems', 'Retrieval pipelines, chunking, ranking, and evals.', 'en', 'amateur', 8, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://opencoursemap.dev/demo/build-with-mcp', 'Build with MCP', 'Protocol concepts and tool-enabled apps.', 'en', 'amateur', 4, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/ml-refresher', 'Machine Learning Refresher', 'Statistics and ML basics for GenAI work.', 'en', 'basic', 12, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/responsible-agents', 'Responsible AI Agents', 'Operational and policy guardrails for agentic systems.', 'en', 'professional', 7, true, 'suspected', now(), true, now()),
  ('40000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/fine-tuning-ops', 'Fine-Tuning and MLOps', 'Bridge adaptation experiments and production operations.', 'en', 'professional', 10, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/python-for-ai', 'Python for AI Workflows', 'Python essentials for notebooks, APIs, and automation.', 'en', 'basic', 6, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://opencoursemap.dev/demo/vector-search', 'Vector Search Fundamentals', 'Embeddings, vector indices, and retrieval tuning.', 'en', 'amateur', 5, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'https://opencoursemap.dev/demo/evals-basics', 'Evaluation Basics for LLM Apps', 'Prompt, retrieval, and model quality evaluation.', 'en', 'amateur', 4, true, 'verified', now(), true, now()),
  ('40000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'https://opencoursemap.dev/demo/slm-deployment', 'SLM Deployment Patterns', 'Deploying smaller models with latency and cost constraints.', 'en', 'professional', 6, true, 'verified', now(), true, now())
on conflict (id) do nothing;

insert into public.courses (resource_id, enrollment_url, instructor_name, course_mode, has_certificate, certificate_is_free, prerequisite_text, syllabus, last_verified_at)
values
  ('40000000-0000-0000-0000-000000000001', 'https://www.deeplearning.ai/short-courses/', 'OpenCourseMap Demo', 'self-paced', false, false, 'Basic Python familiarity helps.', 'LLM basics, prompting, retrieval, evaluation.', now()),
  ('40000000-0000-0000-0000-000000000002', 'https://huggingface.co/learn', 'Community Team', 'self-paced', true, false, 'LLM basics and embeddings concepts.', 'Indexing, embeddings, retrieval, evals, ops.', now()),
  ('40000000-0000-0000-0000-000000000003', 'https://huggingface.co/learn', 'Platform Engineering', 'self-paced', false, false, 'Basic LLM concepts.', 'Protocol primitives, tools, sessions, server design.', now()),
  ('40000000-0000-0000-0000-000000000004', 'https://www.coursera.org', 'University Partner', 'self-paced', true, false, 'None.', 'Python, statistics, experimentation, classical ML.', now()),
  ('40000000-0000-0000-0000-000000000005', 'https://www.deeplearning.ai/short-courses/', 'Safety Team', 'cohort', false, false, 'Familiarity with agent systems.', 'Threat modeling, evals, tool risk, governance.', now()),
  ('40000000-0000-0000-0000-000000000006', 'https://www.coursera.org', 'Ops Faculty', 'live', true, true, 'Model training basics.', 'Data prep, fine-tune loops, deployment, observability.', now()),
  ('40000000-0000-0000-0000-000000000007', 'https://www.deeplearning.ai/short-courses/', 'Platform Team', 'self-paced', false, false, 'No prior coding required.', 'Python syntax, data structures, scripts, APIs.', now()),
  ('40000000-0000-0000-0000-000000000008', 'https://huggingface.co/learn', 'Infra Team', 'self-paced', false, false, 'LLM basics.', 'Embeddings, ANN search, index updates, observability.', now()),
  ('40000000-0000-0000-0000-000000000009', 'https://www.coursera.org', 'Evaluation Faculty', 'self-paced', false, false, 'Prompt and retrieval basics.', 'Offline evals, regression suites, human review.', now()),
  ('40000000-0000-0000-0000-000000000010', 'https://huggingface.co/learn', 'Systems Team', 'self-paced', false, false, 'Model serving basics.', 'Quantization, packaging, serving, latency budgets.', now())
on conflict (resource_id) do nothing;

insert into public.course_topics (course_id, topic_id, is_primary)
values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', true),
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', false),
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000106', false),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000107', true),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000108', false),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000111', false),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000103', true),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000109', false),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000105', true),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000114', false),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000115', false),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000109', true),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000113', false),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000111', false),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000110', true),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000112', false),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000101', false),
  ('40000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000114', true),
  ('40000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000108', true),
  ('40000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000111', true),
  ('40000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000102', true)
on conflict do nothing;

insert into public.course_skills (course_id, skill_id, strength)
values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 0.9),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 0.7),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 1.0),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 0.8),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 0.8),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 0.7),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 1.0),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 0.6),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000005', 0.7)
on conflict do nothing;

insert into public.learning_paths (id, slug, title, description, target_level, topic_id, is_published)
values
  ('50000000-0000-0000-0000-000000000001', 'generative-ai-foundations', 'Generative AI Foundations', 'A guided path from Python and ML basics into practical LLM workflows.', 'basic', '00000000-0000-0000-0000-000000000104', true),
  ('50000000-0000-0000-0000-000000000002', 'professional-llm-engineer-path', 'Professional LLM Engineer Path', 'Production-oriented track covering RAG, MCP, agents, and operations.', 'professional', '00000000-0000-0000-0000-000000000101', true)
on conflict (id) do nothing;

insert into public.learning_path_items (id, learning_path_id, course_id, sequence_no, is_required, rationale)
values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000007', 1, true, 'Establishes Python basics.'),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 2, true, 'Adds ML and statistics context.'),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 3, true, 'Introduces LLM workflows.'),
  ('60000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 1, true, 'Common LLM foundations.'),
  ('60000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 2, true, 'Core retrieval architecture skills.'),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', 3, true, 'Protocol and tool integration.'),
  ('60000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000006', 4, true, 'Production lifecycle and ops.')
on conflict (id) do nothing;

insert into public.source_runs (id, source_id, status, started_at, finished_at, discovered_count, inserted_count, updated_count, rejected_count)
values
  ('70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'succeeded', now() - interval '1 day', now() - interval '1 day' + interval '2 minutes', 8, 2, 3, 3)
on conflict (id) do nothing;

insert into public.ingestion_candidates (id, source_run_id, discovered_url, canonical_url, title, metadata, parse_status, confidence_score)
values
  ('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'https://example.com/free-mcp-course', 'https://example.com/free-mcp-course', 'Free MCP Course', '{"providerName":"Example Provider","topicSlugs":["mcp","ai-agents"],"difficulty":"amateur"}'::jsonb, 'needs_review', 0.82),
  ('80000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', 'https://example.com/paid-course', null, 'Likely Paid Course', '{"reason":"Pricing wall detected"}'::jsonb, 'rejected', 0.48)
on conflict (id) do nothing;

insert into public.providers (id, name, website_url, provider_type)
values
  ('10000000-0000-0000-0000-000000000004', 'OpenAI', 'https://openai.com', 'community'),
  ('10000000-0000-0000-0000-000000000005', 'Anthropic', 'https://www.anthropic.com', 'community'),
  ('10000000-0000-0000-0000-000000000006', 'LinkedIn', 'https://www.linkedin.com', 'mooc'),
  ('10000000-0000-0000-0000-000000000007', 'Microsoft', 'https://www.microsoft.com', 'docs'),
  ('10000000-0000-0000-0000-000000000008', 'IBM SkillsBuild', 'https://skillsbuild.org/students/course-catalog/artificial-intelligence', 'community'),
  ('10000000-0000-0000-0000-000000000009', 'Amazon Web Services', 'https://aws.amazon.com', 'community'),
  ('10000000-0000-0000-0000-000000000010', 'Google', 'https://cloud.google.com', 'docs'),
  ('10000000-0000-0000-0000-000000000011', 'Perplexity', 'https://www.perplexity.ai', 'docs'),
  ('10000000-0000-0000-0000-000000000012', 'Meta', 'https://www.meta.com', 'community')
on conflict (id) do nothing;

insert into public.resources (id, provider_id, source_id, canonical_url, title, summary, language_code, difficulty, duration_hours, is_free, free_verification_status, free_verified_at, is_active, published_at)
values
  ('40000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'https://academy.openai.com/', 'OpenAI Academy', 'OpenAI''s official academy hub with workshops, guides, and practical AI learning tracks.', 'en', 'amateur', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'https://www.anthropic.com/learn', 'Anthropic Academy', 'Anthropic''s official learning hub for Claude guides, prompting, evaluation, and safety.', 'en', 'amateur', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 'https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin', 'Career Essentials in Generative AI by Microsoft and LinkedIn', 'LinkedIn Learning path for generative AI foundations and practical workplace adoption.', 'en', 'basic', 4.00, true, 'suspected', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 'https://microsoft.github.io/generative-ai-for-beginners/', 'Generative AI for Beginners', 'Microsoft''s official beginner series for generative AI concepts and app patterns.', 'en', 'basic', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000001', 'https://skillsbuild.org/students/course-catalog/artificial-intelligence', 'IBM SkillsBuild AI Foundations', 'IBM''s official SkillsBuild catalog for foundational AI literacy and responsible deployment themes.', 'en', 'basic', 15.00, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000001', 'https://aws.amazon.com/training/learn-about/generative-ai/', 'AWS Dev Hour: Learn Gen AI from Scratch!', 'AWS''s official training series for GenAI newcomers and hands-on builders.', 'en', 'amateur', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000001', 'https://www.cloudskillsboost.google/course_templates/536', 'Introduction to Generative AI', 'Google Cloud Skills Boost microlearning course on generative AI fundamentals.', 'en', 'basic', 0.75, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000001', 'https://docs.perplexity.ai/cookbook/getting_started', 'Perplexity API Cookbook', 'Perplexity''s official cookbook for building search-augmented AI experiences.', 'en', 'amateur', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000001', 'https://www.meta.com/ai/open-source/', 'Open Source AI by Meta', 'Meta''s official resource hub for Llama models, toolkits, and community programs.', 'en', 'amateur', null, true, 'verified', '2026-03-15T09:00:00.000Z', true, '2026-03-15T09:00:00.000Z')
on conflict (id) do nothing;

insert into public.courses (resource_id, enrollment_url, instructor_name, course_mode, has_certificate, certificate_is_free, prerequisite_text, syllabus, last_verified_at)
values
  ('40000000-0000-0000-0000-000000000011', 'https://academy.openai.com/', 'OpenAI Academy', 'hybrid', false, false, 'No prerequisite for academy browsing; specific sessions vary by level.', 'Workshops, prompts, classroom use, building blocks, and community programming.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000012', 'https://www.anthropic.com/learn', 'Anthropic Team', 'self-paced', false, false, 'Helpful if you already understand basic LLM concepts.', 'Claude usage patterns, safe deployment, prompting, and product workflows.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000013', 'https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin', 'Microsoft and LinkedIn', 'self-paced', true, false, 'No prerequisites listed.', 'Generative AI basics, workplace use cases, responsible practices, and prompting.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000014', 'https://microsoft.github.io/generative-ai-for-beginners/', 'Microsoft Learn', 'self-paced', false, false, 'Helpful if you know basic programming concepts.', 'Generative AI concepts, prompts, responsible AI, apps, and deployment basics.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000015', 'https://skillsbuild.org/students/course-catalog/artificial-intelligence', 'IBM SkillsBuild', 'self-paced', false, false, 'No prerequisites listed.', 'AI basics, machine learning concepts, ethics, and practical business context.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000016', 'https://aws.amazon.com/training/learn-about/generative-ai/', 'AWS Training and Certification', 'self-paced', false, false, 'Beginner-friendly entry point.', 'GenAI fundamentals, AWS tooling landscape, and practical next steps.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000017', 'https://www.cloudskillsboost.google/course_templates/536', 'Google Cloud Skills Boost', 'self-paced', false, false, 'No prerequisites listed.', 'Generative AI definition, model families, and high-level application patterns.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000018', 'https://docs.perplexity.ai/cookbook/getting_started', 'Perplexity Developer Docs', 'self-paced', false, false, 'Helpful if you are comfortable with APIs and prompt-driven workflows.', 'Getting started, request patterns, citations, and application recipes.', '2026-03-15T09:00:00.000Z'),
  ('40000000-0000-0000-0000-000000000019', 'https://www.meta.com/ai/open-source/', 'Meta AI', 'self-paced', false, false, 'Useful if you want an overview of the Meta open model ecosystem.', 'Llama resources, tooling, programs, and open model adoption guidance.', '2026-03-15T09:00:00.000Z')
on conflict (resource_id) do nothing;

insert into public.course_topics (course_id, topic_id, is_primary)
values
  ('40000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000101', true),
  ('40000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000106', false),
  ('40000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000109', false),
  ('40000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000101', true),
  ('40000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000106', false),
  ('40000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000113', false),
  ('40000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000104', true),
  ('40000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000101', false),
  ('40000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000113', false),
  ('40000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000104', true),
  ('40000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000101', false),
  ('40000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000106', false),
  ('40000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000105', true),
  ('40000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000104', false),
  ('40000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000113', false),
  ('40000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000104', true),
  ('40000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000101', false),
  ('40000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000109', false),
  ('40000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000104', true),
  ('40000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000101', false),
  ('40000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000113', false),
  ('40000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000101', true),
  ('40000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000109', false),
  ('40000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000107', false),
  ('40000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000101', true),
  ('40000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000105', false),
  ('40000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000113', false)
on conflict do nothing;

insert into public.course_skills (course_id, skill_id, strength)
values
  ('40000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000003', 0.8),
  ('40000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000002', 0.8),
  ('40000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 0.8),
  ('40000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000005', 0.8),
  ('40000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000003', 0.7),
  ('40000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002', 0.7),
  ('40000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000003', 0.8),
  ('40000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000002', 0.7),
  ('40000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000006', 0.7),
  ('40000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000003', 0.6),
  ('40000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000003', 0.8),
  ('40000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000004', 0.7),
  ('40000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000003', 0.7),
  ('40000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000002', 0.6),
  ('40000000-0000-0000-0000-000000000018', '20000000-0000-0000-0000-000000000004', 0.8),
  ('40000000-0000-0000-0000-000000000018', '20000000-0000-0000-0000-000000000002', 0.6),
  ('40000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000003', 0.8),
  ('40000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000005', 0.7)
on conflict do nothing;
