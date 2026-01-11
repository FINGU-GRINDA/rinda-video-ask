-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website TEXT,
  business_hours JSONB DEFAULT '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": null,
    "sunday": null
  }',
  timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{
    "default_language": "ko",
    "notification_email": null,
    "slack_webhook_url": null,
    "kakao_webhook_url": null,
    "hubspot_api_key": null,
    "salesforce_config": null
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  domain TEXT,
  widget_config JSONB DEFAULT '{
    "position": "bottom-right",
    "theme": "light",
    "primary_color": "#6366f1",
    "accent_color": "#818cf8",
    "border_radius": 16,
    "show_branding": true,
    "mobile_fullscreen": true,
    "auto_play": true,
    "sound_enabled": true,
    "language": "ko",
    "custom_css": null,
    "z_index": 999999
  }',
  ai_config JSONB DEFAULT '{
    "enabled": true,
    "auto_respond": true,
    "response_delay_ms": 1000,
    "tone": "friendly",
    "language": "ko",
    "max_auto_responses": 5,
    "escalation_keywords": ["urgent", "help", "human", "manager", "담당자", "급해요", "사람"],
    "knowledge_base_enabled": true
  }',
  embed_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video messages
CREATE TABLE video_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0,
  transcription TEXT,
  translations JSONB DEFAULT '{}',
  captions JSONB DEFAULT '[]',
  trigger_rules JSONB DEFAULT '[]',
  response_options JSONB DEFAULT '[]',
  next_video_map JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  video_message_id UUID REFERENCES video_messages(id) ON DELETE SET NULL,
  visitor_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('video', 'voice', 'text', 'phone', 'quick_reply')),
  response_url TEXT,
  response_text TEXT,
  transcription TEXT,
  translation TEXT,
  ai_analysis JSONB,
  visitor_context JSONB DEFAULT '{
    "page_url": "",
    "page_title": "",
    "referrer": null,
    "utm_source": null,
    "utm_medium": null,
    "utm_campaign": null,
    "utm_content": null,
    "utm_term": null,
    "device_type": "desktop",
    "browser": "",
    "os": "",
    "country": null,
    "city": null,
    "company_info": null,
    "visit_count": 1,
    "pages_viewed": [],
    "time_on_site": 0,
    "scroll_depth": 0
  }',
  contact_info JSONB,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'qualified', 'converted', 'archived')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base with vector embeddings
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('pdf', 'url', 'text', 'faq')),
  source_url TEXT,
  embedding vector(1536),
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI conversations log
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  context JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  video_message_id UUID REFERENCES video_messages(id) ON DELETE SET NULL,
  visitor_id VARCHAR(100) NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_videos_project ON video_messages(project_id);
CREATE INDEX idx_videos_active ON video_messages(project_id, is_active);
CREATE INDEX idx_leads_project ON leads(project_id);
CREATE INDEX idx_leads_status ON leads(project_id, status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_visitor ON leads(visitor_id);
CREATE INDEX idx_knowledge_project ON knowledge_base(project_id);
CREATE INDEX idx_ai_conv_lead ON ai_conversations(lead_id);
CREATE INDEX idx_analytics_project ON analytics_events(project_id);
CREATE INDEX idx_analytics_video ON analytics_events(video_message_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- Vector similarity search index
CREATE INDEX idx_knowledge_embedding ON knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Function for semantic search in knowledge base
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_project_id uuid
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE kb.project_id = p_project_id
    AND kb.is_active = true
    AND kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_messages_updated_at
  BEFORE UPDATE ON video_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their organizations" ON organizations
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Organization members policies
CREATE POLICY "Users can view members of their organizations" ON organization_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage members" ON organization_members
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Projects policies
CREATE POLICY "Users can view projects in their organizations" ON projects
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage projects" ON projects
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

-- Video messages policies
CREATE POLICY "Users can view videos in their projects" ON video_messages
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage videos" ON video_messages
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- Leads policies
CREATE POLICY "Users can view leads in their projects" ON leads
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage leads" ON leads
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- Knowledge base policies
CREATE POLICY "Users can view knowledge base in their projects" ON knowledge_base
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage knowledge base" ON knowledge_base
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- AI conversations policies
CREATE POLICY "Users can view AI conversations in their projects" ON ai_conversations
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view analytics in their projects" ON analytics_events
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- Public access policies for widget (using project embed_code as API key)
CREATE POLICY "Public can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read active videos by project" ON video_messages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read project config" ON projects
  FOR SELECT USING (is_active = true);

-- Increment view count function
CREATE OR REPLACE FUNCTION increment_video_view_count(video_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_messages
  SET view_count = view_count + 1
  WHERE id = video_id;
END;
$$;

-- Increment response count function
CREATE OR REPLACE FUNCTION increment_video_response_count(video_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_messages
  SET response_count = response_count + 1
  WHERE id = video_id;
END;
$$;

-- Generate embed code for project
CREATE OR REPLACE FUNCTION generate_embed_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.embed_code = encode(gen_random_bytes(16), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_embed_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION generate_embed_code();
