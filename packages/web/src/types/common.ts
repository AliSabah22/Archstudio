export enum ProjectPhase {
  PreDesign = 'pre_design',
  SchematicDesign = 'schematic_design',
  DesignDevelopment = 'design_development',
  ConstructionDocuments = 'construction_documents',
  Bidding = 'bidding',
  ConstructionAdministration = 'construction_administration',
}

export enum ProjectStatus {
  Active = 'active',
  OnHold = 'on_hold',
  Completed = 'completed',
}

export enum ProjectType {
  Residential = 'residential',
  Commercial = 'commercial',
  Institutional = 'institutional',
  Interior = 'interior',
  MixedUse = 'mixed_use',
}

export enum InvoiceStatus {
  Draft = 'draft',
  Sent = 'sent',
  Paid = 'paid',
  Overdue = 'overdue',
}

export enum PipelineStage {
  InitialContact = 'initial_contact',
  Consultation = 'consultation',
  ProposalSent = 'proposal_sent',
  Shortlisted = 'shortlisted',
  Won = 'won',
  Lost = 'lost',
}

export enum UserRole {
  Principal = 'principal',
  SeniorArchitect = 'senior_architect',
  Architect = 'architect',
  Designer = 'designer',
  Intern = 'intern',
  Admin = 'admin',
}

export enum FeeStructure {
  PercentageOfConstruction = 'percentage_of_construction',
  HourlyRate = 'hourly_rate',
  FixedFee = 'fixed_fee',
  Stipulated = 'stipulated',
}

export enum EventType {
  Meeting = 'meeting',
  SiteVisit = 'site_visit',
  Deadline = 'deadline',
  Standup = 'standup',
  Consultation = 'consultation',
}

export enum LeadChannel {
  Instagram = 'instagram',
  Website = 'website',
  Referral = 'referral',
  GoogleAds = 'google_ads',
}
