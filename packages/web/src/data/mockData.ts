import {
  ProjectPhase,
  ProjectStatus,
  ProjectType,
  InvoiceStatus,
  PipelineStage,
  UserRole,
  FeeStructure,
  EventType,
  LeadChannel,
} from '@/types/common'
import type { Project } from '@/types/project'
import type { TeamMember } from '@/types/team'
import type { PipelineOpportunity, ClosedOpportunity } from '@/types/pipeline'
import type { Invoice } from '@/types/invoice'
import type { Estimate } from '@/types/estimate'
import type { ClientRecord } from '@/types/client'
import type { TimeEntry } from '@/stores/appStore'

// ─── Team Members ────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_001',
    name: 'Pamir Dogan',
    initials: 'PD',
    role: UserRole.Principal,
    email: 'pamir@archstudio.ca',
    phone: '416-555-0101',
    hourlyRate: 250,
    utilization: 82,
    trailingUtilization: 80,
    weeklyHoursLogged: 38,
    billableHoursThisMonth: 98,
    totalHoursThisMonth: 120,
    activeProjectCount: 4,
    activeProjectIds: ['proj_001', 'proj_002', 'proj_003', 'proj_004'],
    joinedAt: '2015-03-01',
    weeklyHours: [36, 38, 40, 38],
  },
  {
    id: 'tm_002',
    name: 'Sara Levi',
    initials: 'SL',
    role: UserRole.SeniorArchitect,
    email: 'sara@archstudio.ca',
    phone: '416-555-0102',
    hourlyRate: 175,
    utilization: 94,
    trailingUtilization: 94,
    weeklyHoursLogged: 42,
    billableHoursThisMonth: 113,
    totalHoursThisMonth: 120,
    activeProjectCount: 3,
    activeProjectIds: ['proj_001', 'proj_005', 'proj_006'],
    joinedAt: '2018-06-15',
    weeklyHours: [44, 43, 45, 42],
  },
  {
    id: 'tm_003',
    name: 'Marcus Osei',
    initials: 'MO',
    role: UserRole.SeniorArchitect,
    email: 'marcus@archstudio.ca',
    phone: '416-555-0103',
    hourlyRate: 165,
    utilization: 78,
    trailingUtilization: 76,
    weeklyHoursLogged: 38,
    billableHoursThisMonth: 94,
    totalHoursThisMonth: 120,
    activeProjectCount: 2,
    activeProjectIds: ['proj_002', 'proj_004'],
    joinedAt: '2019-01-10',
    weeklyHours: [36, 38, 37, 38],
  },
  {
    id: 'tm_004',
    name: 'Yuki Tanaka',
    initials: 'YT',
    role: UserRole.Architect,
    email: 'yuki@archstudio.ca',
    phone: '416-555-0104',
    hourlyRate: 130,
    utilization: 85,
    trailingUtilization: 87,
    weeklyHoursLogged: 36,
    billableHoursThisMonth: 102,
    totalHoursThisMonth: 120,
    activeProjectCount: 3,
    activeProjectIds: ['proj_001', 'proj_003', 'proj_005'],
    joinedAt: '2020-09-01',
    weeklyHours: [37, 36, 38, 36],
  },
  {
    id: 'tm_005',
    name: 'Amara Diallo',
    initials: 'AD',
    role: UserRole.Architect,
    email: 'amara@archstudio.ca',
    phone: '416-555-0105',
    hourlyRate: 120,
    utilization: 72,
    trailingUtilization: 74,
    weeklyHoursLogged: 34,
    billableHoursThisMonth: 86,
    totalHoursThisMonth: 120,
    activeProjectCount: 2,
    activeProjectIds: ['proj_002', 'proj_006'],
    joinedAt: '2021-04-19',
    weeklyHours: [33, 35, 34, 34],
  },
  {
    id: 'tm_006',
    name: 'Chen Wei',
    initials: 'CW',
    role: UserRole.Designer,
    email: 'chen@archstudio.ca',
    phone: '416-555-0106',
    hourlyRate: 95,
    utilization: 88,
    trailingUtilization: 86,
    weeklyHoursLogged: 40,
    billableHoursThisMonth: 106,
    totalHoursThisMonth: 120,
    activeProjectCount: 4,
    activeProjectIds: ['proj_001', 'proj_002', 'proj_004', 'proj_005'],
    joinedAt: '2022-02-07',
    weeklyHours: [39, 41, 40, 40],
  },
  {
    id: 'tm_007',
    name: 'Priya Sharma',
    initials: 'PS',
    role: UserRole.Designer,
    email: 'priya@archstudio.ca',
    phone: '416-555-0107',
    hourlyRate: 90,
    utilization: 65,
    trailingUtilization: 63,
    weeklyHoursLogged: 29,
    billableHoursThisMonth: 78,
    totalHoursThisMonth: 120,
    activeProjectCount: 2,
    activeProjectIds: ['proj_003', 'proj_006'],
    joinedAt: '2022-08-15',
    weeklyHours: [30, 28, 0, 29],
  },
  {
    id: 'tm_008',
    name: 'James Okonkwo',
    initials: 'JO',
    role: UserRole.Intern,
    email: 'james@archstudio.ca',
    phone: '416-555-0108',
    hourlyRate: 55,
    utilization: 60,
    trailingUtilization: 62,
    weeklyHoursLogged: 36,
    billableHoursThisMonth: 72,
    totalHoursThisMonth: 120,
    activeProjectCount: 1,
    activeProjectIds: ['proj_005'],
    joinedAt: '2024-01-08',
    weeklyHours: [35, 36, 36, 36],
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'proj_001',
    name: 'Mehta Residence',
    clientId: 'client_001',
    clientName: 'Mehta Family',
    type: ProjectType.Residential,
    phase: ProjectPhase.DesignDevelopment,
    status: ProjectStatus.Active,
    progress: 58,
    budget: 280000,
    spent: 162400,
    startDate: '2025-10-15',
    dueDate: '2026-08-30',
    members: [
      { id: 'tm_001', name: 'Pamir Dogan', initials: 'PD', role: UserRole.Principal },
      { id: 'tm_002', name: 'Sara Levi', initials: 'SL', role: UserRole.SeniorArchitect },
      { id: 'tm_004', name: 'Yuki Tanaka', initials: 'YT', role: UserRole.Architect },
      { id: 'tm_006', name: 'Chen Wei', initials: 'CW', role: UserRole.Designer },
    ],
    priority: 'high',
    address: '42 Rosedale Heights Dr, Toronto ON',
    description: 'Complete renovation and addition to a 1930s heritage home in Rosedale. Scope includes rear addition, kitchen, master suite, and landscape integration.',
    projectBudget: {
      totalEstimatedHours: 680,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 40, actualHours: 38 },
        { phase: 'Schematic Design', estimatedHours: 140, actualHours: 150 },
        { phase: 'Design Development', estimatedHours: 200, actualHours: 128 },
        { phase: 'Construction Docs', estimatedHours: 260, actualHours: 0 },
        { phase: 'Construction Admin', estimatedHours: 40, actualHours: 0 },
      ],
      assumptions: 'Up to 3 client meetings per phase. 2 rounds of revisions per deliverable.',
      exclusions: '3D renderings, interior design, landscape design, furniture selection.',
      changeOrders: [
        { id: 1, description: 'Heritage facade review — additional documentation required', hours: 24, cost: 4200, status: 'approved', date: '2026-01-20' },
        { id: 2, description: 'Third design option — contemporary aesthetic', hours: 16, cost: 2800, status: 'pending', date: '2026-03-10' },
      ],
    },
    consultants: [
      { name: 'North Structural', specialty: 'Structural', budgeted: 28000, spent: 18500, markup: 10, passedThrough: 16500, pendingPassThrough: 2000 },
    ],
    financials: {
      invoiced: 213750,
      collected: 171000,
      outstanding: 42750,
      directLabor: 142800,
      consultantCosts: 18500,
      expenses: 2100,
      totalCost: 163400,
      grossMargin: 50350,
      marginPercent: 23.5,
    },
  },
  {
    id: 'proj_002',
    name: 'Chen Commercial Complex',
    clientId: 'client_002',
    clientName: 'Chen Commercial Group',
    type: ProjectType.Commercial,
    phase: ProjectPhase.ConstructionDocuments,
    status: ProjectStatus.Active,
    progress: 74,
    budget: 1200000,
    spent: 888000,
    startDate: '2025-05-01',
    dueDate: '2026-06-15',
    members: [
      { id: 'tm_001', name: 'Pamir Dogan', initials: 'PD', role: UserRole.Principal },
      { id: 'tm_003', name: 'Marcus Osei', initials: 'MO', role: UserRole.SeniorArchitect },
      { id: 'tm_005', name: 'Amara Diallo', initials: 'AD', role: UserRole.Architect },
      { id: 'tm_006', name: 'Chen Wei', initials: 'CW', role: UserRole.Designer },
    ],
    priority: 'high',
    address: '1200 Yonge St, Toronto ON',
    description: 'Mixed-use commercial complex featuring ground-floor retail with 4 floors of office space above. Targeting LEED Gold certification.',
    projectBudget: {
      totalEstimatedHours: 2800,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 120, actualHours: 118 },
        { phase: 'Schematic Design', estimatedHours: 500, actualHours: 492 },
        { phase: 'Design Development', estimatedHours: 800, actualHours: 828 },
        { phase: 'Construction Docs', estimatedHours: 1200, actualHours: 580 },
        { phase: 'Construction Admin', estimatedHours: 180, actualHours: 0 },
      ],
      assumptions: 'Up to 4 client meetings per phase. LEED documentation included.',
      exclusions: 'Civil engineering, landscape architecture, tenant fit-outs.',
      changeOrders: [
        { id: 1, description: 'LEED Gold upgrade — additional documentation and coordination', hours: 80, cost: 14000, status: 'approved', date: '2025-10-05' },
        { id: 2, description: 'Rooftop amenity redesign', hours: 40, cost: 7000, status: 'approved', date: '2026-01-12' },
      ],
    },
    consultants: [
      { name: 'Chen Structural', specialty: 'Structural', budgeted: 45000, spent: 28000, markup: 10, passedThrough: 25200, pendingPassThrough: 2800 },
      { name: 'MEP Associates', specialty: 'Mechanical/Electrical', budgeted: 32000, spent: 32000, markup: 10, passedThrough: 28000, pendingPassThrough: 7200 },
    ],
    financials: {
      invoiced: 920000,
      collected: 800000,
      outstanding: 120000,
      directLabor: 612000,
      consultantCosts: 60000,
      expenses: 8500,
      totalCost: 680500,
      grossMargin: 239500,
      marginPercent: 26.0,
    },
  },
  {
    id: 'proj_003',
    name: 'Thornton Community Library',
    clientId: 'client_003',
    clientName: 'City of Toronto — Public Libraries',
    type: ProjectType.Institutional,
    phase: ProjectPhase.SchematicDesign,
    status: ProjectStatus.Active,
    progress: 32,
    budget: 850000,
    spent: 272000,
    startDate: '2026-01-10',
    dueDate: '2027-03-31',
    members: [
      { id: 'tm_001', name: 'Pamir Dogan', initials: 'PD', role: UserRole.Principal },
      { id: 'tm_004', name: 'Yuki Tanaka', initials: 'YT', role: UserRole.Architect },
      { id: 'tm_007', name: 'Priya Sharma', initials: 'PS', role: UserRole.Designer },
    ],
    priority: 'medium',
    address: '800 Thornton Ave, Toronto ON',
    description: 'New 12,000 sq ft community library with integrated makerspace, children\'s programming wing, and public plaza.',
    projectBudget: {
      totalEstimatedHours: 1600,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 100, actualHours: 96 },
        { phase: 'Schematic Design', estimatedHours: 320, actualHours: 188 },
        { phase: 'Design Development', estimatedHours: 480, actualHours: 0 },
        { phase: 'Construction Docs', estimatedHours: 600, actualHours: 0 },
        { phase: 'Construction Admin', estimatedHours: 100, actualHours: 0 },
      ],
      assumptions: 'Up to 3 community engagement sessions. City review cycles included.',
      exclusions: 'Civil engineering, site servicing, furniture procurement.',
      changeOrders: [],
    },
    consultants: [
      { name: 'Civic MEP Inc.', specialty: 'Mechanical/Electrical', budgeted: 22000, spent: 8000, markup: 10, passedThrough: 7200, pendingPassThrough: 800 },
    ],
    financials: {
      invoiced: 95000,
      collected: 59325,
      outstanding: 35675,
      directLabor: 68000,
      consultantCosts: 8000,
      expenses: 1200,
      totalCost: 77200,
      grossMargin: 17800,
      marginPercent: 18.7,
    },
  },
  {
    id: 'proj_004',
    name: 'Lakeside Penthouse',
    clientId: 'client_004',
    clientName: 'Ramirez & Associates',
    type: ProjectType.Interior,
    phase: ProjectPhase.ConstructionAdministration,
    status: ProjectStatus.Active,
    progress: 88,
    budget: 195000,
    spent: 171600,
    startDate: '2025-07-01',
    dueDate: '2026-04-30',
    members: [
      { id: 'tm_001', name: 'Pamir Dogan', initials: 'PD', role: UserRole.Principal },
      { id: 'tm_003', name: 'Marcus Osei', initials: 'MO', role: UserRole.SeniorArchitect },
      { id: 'tm_006', name: 'Chen Wei', initials: 'CW', role: UserRole.Designer },
    ],
    priority: 'medium',
    address: '1 Harbour Square, Penthouse, Toronto ON',
    description: 'Full interior renovation of a 4,800 sq ft lakefront penthouse. Custom millwork, smart home integration, and art display system.',
    projectBudget: {
      totalEstimatedHours: 480,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 30, actualHours: 28 },
        { phase: 'Schematic Design', estimatedHours: 80, actualHours: 76 },
        { phase: 'Design Development', estimatedHours: 160, actualHours: 172 },
        { phase: 'Construction Docs', estimatedHours: 160, actualHours: 164 },
        { phase: 'Construction Admin', estimatedHours: 50, actualHours: 38 },
      ],
      assumptions: '2 rounds of revisions per phase. Weekly site visits during CA.',
      exclusions: 'Furniture procurement, art curation, AV system programming.',
      changeOrders: [
        { id: 1, description: 'Custom wine cellar addition', hours: 28, cost: 4900, status: 'approved', date: '2025-11-08' },
      ],
    },
    consultants: [],
    financials: {
      invoiced: 171600,
      collected: 147000,
      outstanding: 24600,
      directLabor: 114400,
      consultantCosts: 0,
      expenses: 3800,
      totalCost: 118200,
      grossMargin: 53400,
      marginPercent: 31.1,
    },
  },
  {
    id: 'proj_005',
    name: 'Forest Hill Mixed-Use',
    clientId: 'client_005',
    clientName: 'Greenleaf Developments',
    type: ProjectType.MixedUse,
    phase: ProjectPhase.PreDesign,
    status: ProjectStatus.Active,
    progress: 12,
    budget: 2400000,
    spent: 288000,
    startDate: '2026-02-15',
    dueDate: '2028-12-31',
    members: [
      { id: 'tm_002', name: 'Sara Levi', initials: 'SL', role: UserRole.SeniorArchitect },
      { id: 'tm_004', name: 'Yuki Tanaka', initials: 'YT', role: UserRole.Architect },
      { id: 'tm_006', name: 'Chen Wei', initials: 'CW', role: UserRole.Designer },
      { id: 'tm_008', name: 'James Okonkwo', initials: 'JO', role: UserRole.Intern },
    ],
    priority: 'high',
    address: '400 Forest Hill Rd, Toronto ON',
    description: '8-storey mixed-use development with 60 residential units above 3 floors of office/retail. Transit-oriented with underground parking.',
    projectBudget: {
      totalEstimatedHours: 5200,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 300, actualHours: 188 },
        { phase: 'Schematic Design', estimatedHours: 900, actualHours: 0 },
        { phase: 'Design Development', estimatedHours: 1400, actualHours: 0 },
        { phase: 'Construction Docs', estimatedHours: 2200, actualHours: 0 },
        { phase: 'Construction Admin', estimatedHours: 400, actualHours: 0 },
      ],
      assumptions: 'City pre-application consultation included. Up to 2 zoning amendment rounds.',
      exclusions: 'Civil, landscape, traffic, geotechnical engineering. Interior design of residential units.',
      changeOrders: [],
    },
    consultants: [
      { name: 'Urban Traffic Eng.', specialty: 'Traffic', budgeted: 18000, spent: 0, markup: 10, passedThrough: 0, pendingPassThrough: 0 },
      { name: 'GeoTech Solutions', specialty: 'Geotechnical', budgeted: 12000, spent: 12000, markup: 10, passedThrough: 11000, pendingPassThrough: 2200 },
    ],
    financials: {
      invoiced: 85000,
      collected: 85000,
      outstanding: 0,
      directLabor: 56000,
      consultantCosts: 12000,
      expenses: 1800,
      totalCost: 69800,
      grossMargin: 15200,
      marginPercent: 17.9,
    },
  },
  {
    id: 'proj_006',
    name: 'Harbourfront Bistro',
    clientId: 'client_006',
    clientName: 'Bellani Restaurant Group',
    type: ProjectType.Commercial,
    phase: ProjectPhase.Bidding,
    status: ProjectStatus.OnHold,
    progress: 65,
    budget: 320000,
    spent: 208000,
    startDate: '2025-09-01',
    dueDate: '2026-05-30',
    members: [
      { id: 'tm_002', name: 'Sara Levi', initials: 'SL', role: UserRole.SeniorArchitect },
      { id: 'tm_005', name: 'Amara Diallo', initials: 'AD', role: UserRole.Architect },
      { id: 'tm_007', name: 'Priya Sharma', initials: 'PS', role: UserRole.Designer },
    ],
    priority: 'low',
    address: '249 Queens Quay W, Toronto ON',
    description: 'New 3,200 sq ft waterfront restaurant space with outdoor terracing, custom feature bar, and chef\'s kitchen.',
    projectBudget: {
      totalEstimatedHours: 820,
      phases: [
        { phase: 'Pre-Design', estimatedHours: 50, actualHours: 48 },
        { phase: 'Schematic Design', estimatedHours: 180, actualHours: 176 },
        { phase: 'Design Development', estimatedHours: 280, actualHours: 282 },
        { phase: 'Construction Docs', estimatedHours: 260, actualHours: 96 },
        { phase: 'Construction Admin', estimatedHours: 50, actualHours: 0 },
      ],
      assumptions: 'Client provides full equipment specs. City heritage review not anticipated.',
      exclusions: 'Signage, interior landscaping, AV/lighting design.',
      changeOrders: [
        { id: 1, description: 'Outdoor terrace expansion — permit drawings', hours: 32, cost: 5600, status: 'approved', date: '2025-12-01' },
        { id: 2, description: 'Chef\'s table addition to main floor', hours: 18, cost: 3150, status: 'rejected', date: '2026-02-15' },
      ],
    },
    consultants: [],
    financials: {
      invoiced: 208000,
      collected: 180000,
      outstanding: 28000,
      directLabor: 138000,
      consultantCosts: 0,
      expenses: 2400,
      totalCost: 140400,
      grossMargin: 67600,
      marginPercent: 32.5,
    },
  },
]

// ─── Pipeline Opportunities ───────────────────────────────────────────────────

export const PIPELINE_OPPORTUNITIES: PipelineOpportunity[] = [
  {
    id: 'opp_001',
    name: 'Westmount Estate Renovation',
    contactName: 'Eleanor Fitzgerald',
    contactEmail: 'e.fitzgerald@gmail.com',
    contactPhone: '416-555-0201',
    estimatedValue: 680000,
    probability: 75,
    stage: PipelineStage.ProposalSent,
    projectType: ProjectType.Residential,
    source: LeadChannel.Referral,
    nextAction: 'Follow up on revised proposal',
    nextActionDate: '2026-04-25',
    notes: 'Long-time referral from Mehta family. High-end residential renovation in Westmount.',
    createdAt: '2026-02-20',
    updatedAt: '2026-04-02',
    daysInCurrentStage: 18,
    referredBy: 'Mehta Family',
  },
  {
    id: 'opp_002',
    name: 'Rosedale Custom Home',
    contactName: 'Dr. R. Shah',
    contactEmail: 'rshah@shahmedicine.ca',
    contactPhone: '416-555-0202',
    estimatedValue: 420000,
    probability: 45,
    stage: PipelineStage.Consultation,
    projectType: ProjectType.Residential,
    source: LeadChannel.Referral,
    nextAction: 'Deliver concept presentation',
    nextActionDate: '2026-04-28',
    notes: 'Custom home on 60x150 Rosedale lot. Site recently purchased, planning approval pending.',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-21',
    daysInCurrentStage: 28,
    referredBy: 'Mehta Family',
  },
  {
    id: 'opp_003',
    name: 'Annex Row House Infill',
    contactName: 'David & Claire Novak',
    contactEmail: 'dnovak@email.com',
    contactPhone: '416-555-0203',
    estimatedValue: 210000,
    probability: 90,
    stage: PipelineStage.Shortlisted,
    projectType: ProjectType.Residential,
    source: LeadChannel.Instagram,
    nextAction: 'Sign contract',
    nextActionDate: '2026-04-22',
    notes: 'Infill row house on laneway lot. Client loves our portfolio. Near close.',
    createdAt: '2026-01-15',
    updatedAt: '2026-04-10',
    daysInCurrentStage: 10,
  },
  {
    id: 'opp_004',
    name: 'Koreatown Boutique Hotel',
    contactName: 'Anika Rajan',
    contactEmail: 'anika.rajan@techco.ca',
    contactPhone: '416-555-0204',
    estimatedValue: 1850000,
    probability: 25,
    stage: PipelineStage.InitialContact,
    projectType: ProjectType.Commercial,
    source: LeadChannel.GoogleAds,
    nextAction: 'Schedule discovery call',
    nextActionDate: '2026-04-23',
    notes: '32-room boutique hotel conversion of historic warehouse. Early stage.',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-08',
    daysInCurrentStage: 12,
  },
  {
    id: 'opp_005',
    name: 'St. Lawrence Market Lofts',
    contactName: 'Roberto Bellini',
    contactEmail: 'rbellini@belldev.ca',
    contactPhone: '416-555-0205',
    estimatedValue: 950000,
    probability: 60,
    stage: PipelineStage.Consultation,
    projectType: ProjectType.MixedUse,
    source: LeadChannel.Referral,
    nextAction: 'Submit preliminary fee proposal',
    nextActionDate: '2026-04-30',
    notes: 'Adaptive reuse of historic market building into 24 residential lofts with ground-floor market stalls.',
    createdAt: '2026-02-28',
    updatedAt: '2026-04-05',
    daysInCurrentStage: 15,
  },
]

// ─── Closed Opportunities ─────────────────────────────────────────────────────

export const CLOSED_OPPORTUNITIES: ClosedOpportunity[] = [
  { id: 'closed_001', name: 'Etobicoke Clinic', result: 'lost', value: 320000, lossReason: 'Fee too high', proposalHours: 35, closedAt: '2025-11-15' },
  { id: 'closed_002', name: 'Bloor St Retail Fitout', result: 'won', value: 195000, proposalHours: 28, closedAt: '2025-09-20' },
  { id: 'closed_003', name: 'Mississauga Elementary School', result: 'lost', value: 850000, lossReason: 'Competitor selected', proposalHours: 42, closedAt: '2025-12-10' },
  { id: 'closed_004', name: 'High Park Residence', result: 'won', value: 275000, proposalHours: 18, closedAt: '2025-10-08' },
  { id: 'closed_005', name: 'King West Condo Lobby', result: 'won', value: 180000, proposalHours: 22, closedAt: '2026-01-14' },
  { id: 'closed_006', name: 'Scarborough Office Park', result: 'lost', value: 420000, lossReason: 'Fee too high', proposalHours: 38, closedAt: '2026-02-20' },
  { id: 'closed_007', name: 'Danforth Duplex Conversion', result: 'won', value: 155000, proposalHours: 14, closedAt: '2026-03-01' },
  { id: 'closed_008', name: 'North York Community Hub', result: 'lost', value: 680000, lossReason: 'No budget approved', proposalHours: 28, closedAt: '2026-01-30' },
  { id: 'closed_009', name: 'Liberty Village Cafe', result: 'won', value: 140000, proposalHours: 16, closedAt: '2025-08-22' },
  { id: 'closed_010', name: 'Corktown Townhouse', result: 'won', value: 220000, proposalHours: 20, closedAt: '2025-07-15' },
  { id: 'closed_011', name: 'Midtown Health Clinic', result: 'won', value: 290000, proposalHours: 24, closedAt: '2025-06-10' },
  { id: 'closed_012', name: 'Waterfront Pavilion', result: 'lost', value: 540000, lossReason: 'Fee too high', proposalHours: 44, closedAt: '2025-05-20' },
]

// ─── Pipeline Stage Velocity ──────────────────────────────────────────────────

export const STAGE_VELOCITY: Record<string, number> = {
  [PipelineStage.InitialContact]: 12,
  [PipelineStage.Consultation]: 8,
  [PipelineStage.ProposalSent]: 18,
  [PipelineStage.Shortlisted]: 22,
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    number: 'INV-2026-001',
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    clientId: 'client_001',
    clientName: 'Mehta Family',
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li_001', description: 'Schematic Design Phase — Mehta Residence', quantity: 1, unitPrice: 28000, amount: 28000 },
      { id: 'li_002', description: 'Reimbursables — Survey & Geotechnical', quantity: 1, unitPrice: 4200, amount: 4200 },
    ],
    subtotal: 32200,
    tax: 4186,
    total: 36386,
    issueDate: '2026-01-15',
    dueDate: '2026-02-14',
    paidDate: '2026-02-10',
    notes: 'Thank you for your business.',
  },
  {
    id: 'inv_002',
    number: 'INV-2026-002',
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    clientId: 'client_002',
    clientName: 'Chen Commercial Group',
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li_003', description: 'Design Development Phase — Milestone 2', quantity: 1, unitPrice: 85000, amount: 85000 },
      { id: 'li_004', description: 'Structural Coordination (reimbursable)', quantity: 1, unitPrice: 12500, amount: 12500 },
    ],
    subtotal: 97500,
    tax: 12675,
    total: 110175,
    issueDate: '2026-01-30',
    dueDate: '2026-02-28',
    paidDate: '2026-02-26',
  },
  {
    id: 'inv_003',
    number: 'INV-2026-003',
    projectId: 'proj_004',
    projectName: 'Lakeside Penthouse',
    clientId: 'client_004',
    clientName: 'Ramirez & Associates',
    status: InvoiceStatus.Overdue,
    lineItems: [
      { id: 'li_005', description: 'Construction Administration — Monthly (February)', quantity: 1, unitPrice: 9500, amount: 9500 },
      { id: 'li_006', description: 'Site Visits (4 × @$450)', quantity: 4, unitPrice: 450, amount: 1800 },
    ],
    subtotal: 11300,
    tax: 1469,
    total: 12769,
    issueDate: '2026-03-01',
    dueDate: '2026-03-31',
    notes: 'Payment 20 days overdue. Second notice sent.',
  },
  {
    id: 'inv_004',
    number: 'INV-2026-004',
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    clientId: 'client_002',
    clientName: 'Chen Commercial Group',
    status: InvoiceStatus.Sent,
    lineItems: [
      { id: 'li_007', description: 'Construction Documents — Phase 1 of 3', quantity: 1, unitPrice: 106195, amount: 106195 },
    ],
    subtotal: 106195,
    tax: 13805,
    total: 120000,
    issueDate: '2026-04-01',
    dueDate: '2026-05-01',
  },
  {
    id: 'inv_005',
    number: 'INV-2026-005',
    projectId: 'proj_003',
    projectName: 'Thornton Community Library',
    clientId: 'client_003',
    clientName: 'City of Toronto — Public Libraries',
    status: InvoiceStatus.Sent,
    lineItems: [
      { id: 'li_008', description: 'Pre-Design & Programming Phase', quantity: 1, unitPrice: 45000, amount: 45000 },
      { id: 'li_009', description: 'Community Engagement Sessions (3)', quantity: 3, unitPrice: 2500, amount: 7500 },
    ],
    subtotal: 52500,
    tax: 6825,
    total: 59325,
    issueDate: '2026-04-10',
    dueDate: '2026-05-10',
  },
  {
    id: 'inv_006',
    number: 'INV-2026-006',
    projectId: 'proj_004',
    projectName: 'Lakeside Penthouse',
    clientId: 'client_004',
    clientName: 'Ramirez & Associates',
    status: InvoiceStatus.Overdue,
    lineItems: [
      { id: 'li_010', description: 'Construction Administration — Monthly (March)', quantity: 1, unitPrice: 9500, amount: 9500 },
      { id: 'li_011', description: 'Site Visits (3 × @$450)', quantity: 3, unitPrice: 450, amount: 1350 },
    ],
    subtotal: 10850,
    tax: 1411,
    total: 12261,
    issueDate: '2026-04-01',
    dueDate: '2026-04-10',
    notes: 'Payment overdue. Final notice.',
  },
  {
    id: 'inv_007',
    number: 'INV-2026-007',
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    clientId: 'client_001',
    clientName: 'Mehta Family',
    status: InvoiceStatus.Overdue,
    lineItems: [
      { id: 'li_012', description: 'Design Development Phase — Progress Billing', quantity: 1, unitPrice: 37832, amount: 37832 },
      { id: 'li_013', description: 'Reimbursables — Structural Consultation', quantity: 1, unitPrice: 1668, amount: 1668 },
    ],
    subtotal: 39500,
    tax: 5135,
    total: 42750,
    issueDate: '2026-03-15',
    dueDate: '2026-04-05',
    notes: 'Payment 15 days overdue. Reminder sent Apr 12.',
  },
  {
    id: 'inv_008',
    number: 'INV-2026-008',
    projectId: 'proj_005',
    projectName: 'Forest Hill Mixed-Use',
    clientId: 'client_005',
    clientName: 'Greenleaf Developments',
    status: InvoiceStatus.Draft,
    lineItems: [
      { id: 'li_014', description: 'Pre-Design Study & Site Analysis', quantity: 1, unitPrice: 28000, amount: 28000 },
      { id: 'li_015', description: 'Zoning Review Consultation', quantity: 1, unitPrice: 6500, amount: 6500 },
    ],
    subtotal: 34500,
    tax: 4485,
    total: 38985,
    issueDate: '2026-04-18',
    dueDate: '2026-05-18',
  },
  {
    id: 'inv_009',
    number: 'INV-2026-009',
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    clientId: 'client_002',
    clientName: 'Chen Commercial Group',
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li_016', description: 'Schematic Design — Full Phase Completion', quantity: 1, unitPrice: 110619, amount: 110619 },
    ],
    subtotal: 110619,
    tax: 14381,
    total: 125000,
    issueDate: '2026-02-15',
    dueDate: '2026-03-17',
    paidDate: '2026-03-14',
  },
  {
    id: 'inv_010',
    number: 'INV-2026-010',
    projectId: 'proj_005',
    projectName: 'Forest Hill Mixed-Use',
    clientId: 'client_005',
    clientName: 'Greenleaf Developments',
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li_017', description: 'Pre-Design Phase — Site Studies & Feasibility', quantity: 1, unitPrice: 75221, amount: 75221 },
    ],
    subtotal: 75221,
    tax: 9779,
    total: 85000,
    issueDate: '2026-03-05',
    dueDate: '2026-04-04',
    paidDate: '2026-04-01',
  },
  {
    id: 'inv_011',
    number: 'INV-2026-011',
    projectId: 'proj_006',
    projectName: 'Harbourfront Bistro',
    clientId: 'client_006',
    clientName: 'Bellani Restaurant Group',
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li_018', description: 'Design Development Phase — Completion', quantity: 1, unitPrice: 42478, amount: 42478 },
    ],
    subtotal: 42478,
    tax: 5522,
    total: 48000,
    issueDate: '2026-03-12',
    dueDate: '2026-04-11',
    paidDate: '2026-04-08',
  },
]

// ─── Estimates ────────────────────────────────────────────────────────────────

export const ESTIMATES: Estimate[] = [
  {
    id: 'est_001',
    name: 'Westmount Estate — Full Architectural Services',
    opportunityId: 'opp_001',
    clientName: 'Eleanor Fitzgerald',
    feeStructure: FeeStructure.PercentageOfConstruction,
    estimatedFee: 680000,
    hourBreakdown: [
      { phase: 'Pre-Design', hours: 40, rate: 175, amount: 7000 },
      { phase: 'Schematic Design', hours: 120, rate: 165, amount: 19800 },
      { phase: 'Design Development', hours: 200, rate: 155, amount: 31000 },
      { phase: 'Construction Documents', hours: 350, rate: 145, amount: 50750 },
      { phase: 'Construction Administration', hours: 180, rate: 140, amount: 25200 },
    ],
    status: 'sent',
    createdAt: '2026-03-20',
    expiresAt: '2026-04-20',
    notes: '8.5% of estimated construction cost of $8M. Includes all phases of service.',
  },
  {
    id: 'est_002',
    name: 'Annex Row House — Design + Documentation',
    opportunityId: 'opp_003',
    clientName: 'David & Claire Novak',
    feeStructure: FeeStructure.FixedFee,
    estimatedFee: 210000,
    hourBreakdown: [
      { phase: 'Pre-Design', hours: 20, rate: 175, amount: 3500 },
      { phase: 'Schematic Design', hours: 80, rate: 165, amount: 13200 },
      { phase: 'Design Development', hours: 140, rate: 155, amount: 21700 },
      { phase: 'Construction Documents', hours: 220, rate: 145, amount: 31900 },
    ],
    status: 'accepted',
    createdAt: '2026-03-28',
    expiresAt: '2026-04-28',
    notes: 'Fixed fee covers schematic through construction documents. CA billed separately at $175/hr.',
  },
  {
    id: 'est_003',
    name: 'Koreatown Hotel — Feasibility Study',
    opportunityId: 'opp_004',
    clientName: 'Anika Rajan',
    feeStructure: FeeStructure.HourlyRate,
    estimatedFee: 45000,
    hourBreakdown: [
      { phase: 'Site Analysis', hours: 60, rate: 175, amount: 10500 },
      { phase: 'Program Development', hours: 80, rate: 165, amount: 13200 },
      { phase: 'Concept Options', hours: 100, rate: 155, amount: 15500 },
      { phase: 'Report Production', hours: 40, rate: 145, amount: 5800 },
    ],
    status: 'draft',
    createdAt: '2026-04-10',
    expiresAt: '2026-05-10',
    notes: 'Preliminary feasibility study only. Full project estimate pending.',
  },
  {
    id: 'est_004',
    name: 'Rosedale Custom Home — Full Services',
    opportunityId: 'opp_002',
    clientName: 'Jin-ho Park',
    feeStructure: FeeStructure.PercentageOfConstruction,
    estimatedFee: 520000,
    hourBreakdown: [
      { phase: 'Pre-Design', hours: 50, rate: 250, amount: 12500 },
      { phase: 'Schematic Design', hours: 160, rate: 175, amount: 28000 },
      { phase: 'Design Development', hours: 260, rate: 155, amount: 40300 },
      { phase: 'Construction Documents', hours: 380, rate: 145, amount: 55100 },
      { phase: 'Construction Administration', hours: 160, rate: 140, amount: 22400 },
    ],
    status: 'sent',
    createdAt: '2026-03-10',
    expiresAt: '2026-04-10',
    notes: '8% of estimated construction cost of $6.5M.',
  },
]

// ─── Calendar Events ──────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string
  title: string
  projectId?: string
  projectName?: string
  opportunityId?: string
  type: EventType
  startTime: string
  endTime: string
  date: string
  location?: string
  attendees: string[]
  notes?: string
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_001',
    title: 'Weekly Team Standup',
    type: EventType.Standup,
    startTime: '09:00',
    endTime: '09:30',
    date: '2026-04-20',
    location: 'Studio — Main Room',
    attendees: ['PD', 'SL', 'MO', 'YT', 'AD', 'CW', 'PS', 'JO'],
  },
  {
    id: 'evt_002',
    title: 'Mehta Residence — Design Review',
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    type: EventType.Meeting,
    startTime: '10:30',
    endTime: '12:00',
    date: '2026-04-20',
    location: 'Studio — Boardroom',
    attendees: ['PD', 'SL', 'YT'],
    notes: 'Review DD package before client presentation on Friday.',
  },
  {
    id: 'evt_003',
    title: 'Chen Complex — Site Visit',
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    type: EventType.SiteVisit,
    startTime: '14:00',
    endTime: '16:30',
    date: '2026-04-21',
    location: '1200 Yonge St, Toronto ON',
    attendees: ['MO', 'AD'],
    notes: 'Progress inspection with contractor. Review mechanical rough-in.',
  },
  {
    id: 'evt_004',
    title: 'Fitzgerald — Proposal Follow-up',
    opportunityId: 'opp_001',
    type: EventType.Consultation,
    startTime: '11:00',
    endTime: '12:30',
    date: '2026-04-21',
    location: 'Client Home — 19 Westmount Ave',
    attendees: ['PD', 'SL'],
    notes: 'Second meeting. Bring revised proposal.',
  },
  {
    id: 'evt_005',
    title: 'Library Project — Community Engagement',
    projectId: 'proj_003',
    projectName: 'Thornton Community Library',
    type: EventType.Meeting,
    startTime: '18:00',
    endTime: '20:00',
    date: '2026-04-22',
    location: 'Thornton Community Centre',
    attendees: ['YT', 'PS'],
    notes: 'Public engagement session. Bring schematic options A, B, C.',
  },
  {
    id: 'evt_006',
    title: 'Weekly Team Standup',
    type: EventType.Standup,
    startTime: '09:00',
    endTime: '09:30',
    date: '2026-04-22',
    location: 'Studio — Main Room',
    attendees: ['PD', 'SL', 'MO', 'YT', 'AD', 'CW', 'PS', 'JO'],
  },
  {
    id: 'evt_007',
    title: 'Lakeside Penthouse — CA Deadline',
    projectId: 'proj_004',
    projectName: 'Lakeside Penthouse',
    type: EventType.Deadline,
    startTime: '17:00',
    endTime: '17:00',
    date: '2026-04-23',
    location: '1 Harbour Square',
    attendees: ['MO'],
    notes: 'Millwork shop drawings review deadline.',
  },
  {
    id: 'evt_008',
    title: 'Mehta — Client Presentation',
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    type: EventType.Meeting,
    startTime: '14:00',
    endTime: '16:00',
    date: '2026-04-24',
    location: 'Studio — Boardroom',
    attendees: ['PD', 'SL', 'YT', 'CW'],
    notes: 'Present DD package to Mehta family. Includes 3D renders and material board.',
  },
  {
    id: 'evt_009',
    title: 'Forest Hill — Zoning Pre-Application',
    projectId: 'proj_005',
    projectName: 'Forest Hill Mixed-Use',
    type: EventType.Meeting,
    startTime: '10:00',
    endTime: '11:30',
    date: '2026-04-25',
    location: 'City Hall — Planning Dept',
    attendees: ['SL', 'YT'],
    notes: 'Pre-application consultation with City planning staff.',
  },
  {
    id: 'evt_010',
    title: 'Weekly Team Standup',
    type: EventType.Standup,
    startTime: '09:00',
    endTime: '09:30',
    date: '2026-04-25',
    location: 'Studio — Main Room',
    attendees: ['PD', 'SL', 'MO', 'YT', 'AD', 'CW', 'PS', 'JO'],
  },
]

// ─── Time Entries (past 2 weeks) ──────────────────────────────────────────────

export const TIME_ENTRIES: TimeEntry[] = [
  // Week of Apr 7–11, 2026
  { id: 'te_001', userId: 'tm_001', projectId: 'proj_001', phase: 'Design Development', hours: 3.5, date: '2026-04-07', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_002', userId: 'tm_001', projectId: 'proj_002', phase: 'Construction Docs', hours: 4.0, date: '2026-04-07', activity: 'Coordination', note: 'MEP review', billable: true },
  { id: 'te_003', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 6.0, date: '2026-04-07', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_004', userId: 'tm_002', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-07', activity: 'Site Analysis', note: '', billable: true },
  { id: 'te_005', userId: 'tm_003', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.0, date: '2026-04-07', activity: 'Structural Coordination', note: '', billable: true },
  { id: 'te_006', userId: 'tm_004', projectId: 'proj_003', phase: 'Schematic Design', hours: 4.0, date: '2026-04-07', activity: 'Concept Development', note: '', billable: true },
  { id: 'te_007', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 3.0, date: '2026-04-07', activity: 'Graphics', note: '', billable: true },
  { id: 'te_008', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 3.5, date: '2026-04-07', activity: 'Research', note: '', billable: true },

  { id: 'te_009', userId: 'tm_001', projectId: 'proj_003', phase: 'Schematic Design', hours: 2.0, date: '2026-04-08', activity: 'Client Meeting', note: '', billable: true },
  { id: 'te_010', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 7.0, date: '2026-04-08', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_011', userId: 'tm_003', projectId: 'proj_004', phase: 'Construction Admin', hours: 4.0, date: '2026-04-08', activity: 'Site Review', note: '', billable: true },
  { id: 'te_012', userId: 'tm_004', projectId: 'proj_001', phase: 'Design Development', hours: 5.0, date: '2026-04-08', activity: 'Detailing', note: '', billable: true },
  { id: 'te_013', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.5, date: '2026-04-08', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_014', userId: 'tm_006', projectId: 'proj_002', phase: 'Construction Docs', hours: 6.0, date: '2026-04-08', activity: 'BIM Coordination', note: '', billable: true },
  { id: 'te_015', userId: 'tm_007', projectId: 'proj_006', phase: 'Bidding', hours: 2.5, date: '2026-04-08', activity: 'Tender Documentation', note: '', billable: true },

  { id: 'te_016', userId: 'tm_001', projectId: 'proj_002', phase: 'Construction Docs', hours: 3.0, date: '2026-04-09', activity: 'Client Meeting', note: '', billable: true },
  { id: 'te_017', userId: 'tm_002', projectId: 'proj_005', phase: 'Pre-Design', hours: 8.0, date: '2026-04-09', activity: 'Zoning Analysis', note: '', billable: true },
  { id: 'te_018', userId: 'tm_004', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-09', activity: 'Site Analysis', note: '', billable: true },
  { id: 'te_019', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 6.0, date: '2026-04-09', activity: 'Mechanical Coord', note: '', billable: true },
  { id: 'te_020', userId: 'tm_006', projectId: 'proj_004', phase: 'Construction Admin', hours: 3.5, date: '2026-04-09', activity: 'Millwork Review', note: '', billable: true },
  { id: 'te_021', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 4.0, date: '2026-04-09', activity: 'Presentation Prep', note: '', billable: true },
  { id: 'te_022', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 5.0, date: '2026-04-09', activity: 'Research', note: '', billable: true },

  { id: 'te_023', userId: 'tm_001', projectId: 'proj_001', phase: 'Design Development', hours: 4.0, date: '2026-04-10', activity: 'Drawing Review', note: '', billable: true },
  { id: 'te_024', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 8.0, date: '2026-04-10', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_025', userId: 'tm_003', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.5, date: '2026-04-10', activity: 'Structural Coord', note: '', billable: true },
  { id: 'te_026', userId: 'tm_004', projectId: 'proj_003', phase: 'Schematic Design', hours: 4.5, date: '2026-04-10', activity: 'Community Engagement', note: '', billable: true },
  { id: 'te_027', userId: 'tm_005', projectId: 'proj_006', phase: 'Bidding', hours: 3.0, date: '2026-04-10', activity: 'Contractor Queries', note: '', billable: true },
  { id: 'te_028', userId: 'tm_006', projectId: 'proj_001', phase: 'Design Development', hours: 7.0, date: '2026-04-10', activity: 'BIM Modeling', note: '', billable: true },
  { id: 'te_029', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 3.5, date: '2026-04-10', activity: 'Graphics', note: '', billable: true },
  { id: 'te_030', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-10', activity: 'Due Diligence', note: '', billable: true },

  { id: 'te_031', userId: 'tm_001', projectId: 'proj_004', phase: 'Construction Admin', hours: 2.5, date: '2026-04-11', activity: 'Site Visit', note: '', billable: true },
  { id: 'te_032', userId: 'tm_002', projectId: 'proj_006', phase: 'Bidding', hours: 3.5, date: '2026-04-11', activity: 'Tender Review', note: '', billable: true },
  { id: 'te_033', userId: 'tm_003', projectId: 'proj_004', phase: 'Construction Admin', hours: 4.0, date: '2026-04-11', activity: 'Shop Drawing Review', note: '', billable: true },
  { id: 'te_034', userId: 'tm_004', projectId: 'proj_001', phase: 'Design Development', hours: 5.0, date: '2026-04-11', activity: 'Detailing', note: '', billable: true },
  { id: 'te_035', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.0, date: '2026-04-11', activity: 'Coordination', note: '', billable: true },
  { id: 'te_036', userId: 'tm_006', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.0, date: '2026-04-11', activity: 'Feasibility Study', note: '', billable: true },
  { id: 'te_037', userId: 'tm_007', projectId: 'proj_006', phase: 'Bidding', hours: 2.5, date: '2026-04-11', activity: 'Documentation', note: '', billable: true },
  { id: 'te_038', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.0, date: '2026-04-11', activity: 'Research', note: '', billable: true },

  // Week of Apr 14–18, 2026 (current week)
  { id: 'te_039', userId: 'tm_001', projectId: 'proj_001', phase: 'Design Development', hours: 4.0, date: '2026-04-14', activity: 'Drawing Review', note: '', billable: true },
  { id: 'te_040', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 7.5, date: '2026-04-14', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_041', userId: 'tm_003', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.0, date: '2026-04-14', activity: 'Structural Coord', note: '', billable: true },
  { id: 'te_042', userId: 'tm_004', projectId: 'proj_003', phase: 'Schematic Design', hours: 4.5, date: '2026-04-14', activity: 'Concept Development', note: '', billable: true },
  { id: 'te_043', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.5, date: '2026-04-14', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_044', userId: 'tm_006', projectId: 'proj_002', phase: 'Construction Docs', hours: 6.5, date: '2026-04-14', activity: 'BIM Coordination', note: '', billable: true },
  { id: 'te_045', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 3.0, date: '2026-04-14', activity: 'Graphics', note: '', billable: true },
  { id: 'te_046', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-14', activity: 'Research', note: '', billable: true },

  { id: 'te_047', userId: 'tm_001', projectId: 'proj_002', phase: 'Construction Docs', hours: 3.5, date: '2026-04-15', activity: 'Client Meeting', note: '', billable: true },
  { id: 'te_048', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 8.5, date: '2026-04-15', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_049', userId: 'tm_003', projectId: 'proj_004', phase: 'Construction Admin', hours: 4.5, date: '2026-04-15', activity: 'Site Visit', note: '', billable: true },
  { id: 'te_050', userId: 'tm_004', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.0, date: '2026-04-15', activity: 'Zoning Review', note: '', billable: true },
  { id: 'te_051', userId: 'tm_005', projectId: 'proj_006', phase: 'Bidding', hours: 2.5, date: '2026-04-15', activity: 'Tender Review', note: '', billable: true },
  { id: 'te_052', userId: 'tm_006', projectId: 'proj_001', phase: 'Design Development', hours: 7.0, date: '2026-04-15', activity: 'BIM Modeling', note: '', billable: true },
  { id: 'te_053', userId: 'tm_007', projectId: 'proj_006', phase: 'Bidding', hours: 2.0, date: '2026-04-15', activity: 'Documentation', note: '', billable: true },
  { id: 'te_054', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 5.0, date: '2026-04-15', activity: 'Due Diligence', note: '', billable: true },

  { id: 'te_055', userId: 'tm_001', projectId: 'proj_003', phase: 'Schematic Design', hours: 2.0, date: '2026-04-16', activity: 'Review Meeting', note: '', billable: true },
  { id: 'te_056', userId: 'tm_002', projectId: 'proj_005', phase: 'Pre-Design', hours: 7.0, date: '2026-04-16', activity: 'Zoning Analysis', note: '', billable: true },
  { id: 'te_057', userId: 'tm_003', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.5, date: '2026-04-16', activity: 'Structural Coord', note: '', billable: true },
  { id: 'te_058', userId: 'tm_004', projectId: 'proj_001', phase: 'Design Development', hours: 4.0, date: '2026-04-16', activity: 'Detailing', note: '', billable: true },
  { id: 'te_059', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.0, date: '2026-04-16', activity: 'Mechanical Coord', note: '', billable: true },
  { id: 'te_060', userId: 'tm_006', projectId: 'proj_004', phase: 'Construction Admin', hours: 4.0, date: '2026-04-16', activity: 'Millwork Review', note: '', billable: true },
  { id: 'te_061', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 3.5, date: '2026-04-16', activity: 'Presentation Prep', note: '', billable: true },
  { id: 'te_062', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 5.0, date: '2026-04-16', activity: 'Research', note: '', billable: true },

  { id: 'te_063', userId: 'tm_001', projectId: 'proj_001', phase: 'Design Development', hours: 3.0, date: '2026-04-17', activity: 'Drawing Review', note: '', billable: true },
  { id: 'te_064', userId: 'tm_002', projectId: 'proj_001', phase: 'Design Development', hours: 8.0, date: '2026-04-17', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_065', userId: 'tm_003', projectId: 'proj_002', phase: 'Construction Docs', hours: 6.0, date: '2026-04-17', activity: 'Coordination', note: '', billable: true },
  { id: 'te_066', userId: 'tm_004', projectId: 'proj_003', phase: 'Schematic Design', hours: 4.5, date: '2026-04-17', activity: 'Concept Development', note: '', billable: true },
  { id: 'te_067', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 5.5, date: '2026-04-17', activity: 'Drawing Production', note: '', billable: true },
  { id: 'te_068', userId: 'tm_006', projectId: 'proj_005', phase: 'Pre-Design', hours: 5.5, date: '2026-04-17', activity: 'Feasibility Study', note: '', billable: true },
  { id: 'te_069', userId: 'tm_007', projectId: 'proj_006', phase: 'Bidding', hours: 2.5, date: '2026-04-17', activity: 'Documentation', note: '', billable: true },
  { id: 'te_070', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-17', activity: 'Research', note: '', billable: true },

  { id: 'te_071', userId: 'tm_001', projectId: 'proj_004', phase: 'Construction Admin', hours: 2.5, date: '2026-04-18', activity: 'Site Visit', note: '', billable: true },
  { id: 'te_072', userId: 'tm_002', projectId: 'proj_006', phase: 'Bidding', hours: 3.5, date: '2026-04-18', activity: 'Tender Review', note: '', billable: true },
  { id: 'te_073', userId: 'tm_003', projectId: 'proj_004', phase: 'Construction Admin', hours: 3.0, date: '2026-04-18', activity: 'Shop Drawing Review', note: '', billable: true },
  { id: 'te_074', userId: 'tm_004', projectId: 'proj_001', phase: 'Design Development', hours: 4.5, date: '2026-04-18', activity: 'Detailing', note: '', billable: true },
  { id: 'te_075', userId: 'tm_005', projectId: 'proj_002', phase: 'Construction Docs', hours: 4.0, date: '2026-04-18', activity: 'Coordination', note: '', billable: true },
  { id: 'te_076', userId: 'tm_006', projectId: 'proj_001', phase: 'Design Development', hours: 5.0, date: '2026-04-18', activity: 'BIM Modeling', note: '', billable: true },
  { id: 'te_077', userId: 'tm_007', projectId: 'proj_003', phase: 'Schematic Design', hours: 2.5, date: '2026-04-18', activity: 'Graphics', note: '', billable: true },
  { id: 'te_078', userId: 'tm_008', projectId: 'proj_005', phase: 'Pre-Design', hours: 4.5, date: '2026-04-18', activity: 'Research', note: '', billable: true },
]

// ─── Clients ──────────────────────────────────────────────────────────────────

export const CLIENTS: ClientRecord[] = [
  {
    id: 'client_001',
    name: 'Mehta Family',
    type: 'Residential',
    projects: ['proj_001'],
    totalRevenue: 285000,
    referrals: [{ name: 'Dr. R. Shah', value: 420000 }],
    lastInteraction: '2025-02-15',
    status: 'dormant',
  },
  {
    id: 'client_002',
    name: 'Chen Commercial Group',
    type: 'Commercial',
    projects: ['proj_002'],
    totalRevenue: 1200000,
    referrals: [],
    lastInteraction: '2026-04-15',
    status: 'active',
  },
  {
    id: 'client_003',
    name: 'City of Toronto — Public Libraries',
    type: 'Commercial',
    projects: ['proj_003'],
    totalRevenue: 850000,
    referrals: [],
    lastInteraction: '2026-04-10',
    status: 'active',
  },
  {
    id: 'client_004',
    name: 'Ramirez & Associates',
    type: 'Residential',
    projects: ['proj_004'],
    totalRevenue: 195000,
    referrals: [],
    lastInteraction: '2026-04-08',
    status: 'active',
  },
  {
    id: 'client_005',
    name: 'Greenleaf Developments',
    type: 'Commercial',
    projects: ['proj_005'],
    totalRevenue: 2400000,
    referrals: [{ name: 'King West Developer', value: 380000 }],
    lastInteraction: '2026-04-18',
    status: 'active',
  },
  {
    id: 'client_006',
    name: 'Bellani Restaurant Group',
    type: 'Hospitality',
    projects: ['proj_006'],
    totalRevenue: 320000,
    referrals: [],
    lastInteraction: '2026-03-20',
    status: 'active',
  },
]

// ─── Marketing Channel Data ───────────────────────────────────────────────────

export interface MarketingChannel {
  id: string
  channel: LeadChannel
  label: string
  icon: string
  leadsThisMonth: number
  leadsLastMonth: number
  conversions: number
  conversionRate: number
  revenueAttributed: number
  costThisMonth: number
  cac: number
}

export const MARKETING_CHANNELS: MarketingChannel[] = [
  {
    id: 'mkt_001',
    channel: LeadChannel.Instagram,
    label: 'Instagram',
    icon: 'instagram',
    leadsThisMonth: 18,
    leadsLastMonth: 12,
    conversions: 3,
    conversionRate: 16.7,
    revenueAttributed: 210000,
    costThisMonth: 1200,
    cac: 400,
  },
  {
    id: 'mkt_002',
    channel: LeadChannel.Website,
    label: 'Website',
    icon: 'globe',
    leadsThisMonth: 11,
    leadsLastMonth: 9,
    conversions: 2,
    conversionRate: 18.2,
    revenueAttributed: 1850000,
    costThisMonth: 800,
    cac: 400,
  },
  {
    id: 'mkt_003',
    channel: LeadChannel.Referral,
    label: 'Referrals',
    icon: 'users',
    leadsThisMonth: 7,
    leadsLastMonth: 6,
    conversions: 4,
    conversionRate: 57.1,
    revenueAttributed: 1628000,
    costThisMonth: 0,
    cac: 0,
  },
  {
    id: 'mkt_004',
    channel: LeadChannel.GoogleAds,
    label: 'Google Ads',
    icon: 'search',
    leadsThisMonth: 9,
    leadsLastMonth: 11,
    conversions: 0,
    conversionRate: 0,
    revenueAttributed: 0,
    costThisMonth: 3500,
    cac: 0,
  },
]

export const MARKETING_SUMMARY = {
  totalLeadsThisMonth: 45,
  totalLeadsLastMonth: 38,
  overallConversionRate: 22.2,
  totalRevenueAttributed: 3688000,
  totalCostThisMonth: 5500,
  avgCAC: 550,
}

// ─── Meetings & Decisions (Feature 1) ─────────────────────────────────────────

export interface MeetingDecision {
  id: number
  text: string
  category: 'Materials' | 'Design' | 'Technical' | 'Financial' | 'Schedule'
}

export interface MeetingActionItem {
  id: number
  owner: string
  task: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface Meeting {
  id: number
  projectId: string
  projectName: string
  date: string
  time: string
  type: 'Client Review' | 'Internal Team' | 'Consultant Coordination' | 'Site Visit'
  attendees: { internal: string[]; external: string[] }
  topics: string[]
  decisions: MeetingDecision[]
  actionItems: MeetingActionItem[]
  notes: string
  durationMinutes: number
}

export const MEETINGS: Meeting[] = [
  {
    id: 1,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    date: '2026-03-15',
    time: '14:00',
    type: 'Client Review',
    attendees: {
      internal: ['PD', 'SL', 'YT'],
      external: ['Mr. Mehta (Client)', 'Mrs. Mehta (Client)'],
    },
    topics: [
      'Material selection for exterior cladding',
      'Window placement on east facade',
      'Kitchen layout options',
    ],
    decisions: [
      { id: 1, text: 'Approved brick cladding over metal panel alternative. Client selected warm red-brown tone from samples provided.', category: 'Materials' },
      { id: 2, text: 'Kitchen layout Option B approved — island with seating for 4, walk-in pantry added to north wall.', category: 'Design' },
    ],
    actionItems: [
      { id: 1, owner: 'SL', task: 'Update material specifications with selected brick product', dueDate: '2026-03-22', status: 'completed' },
      { id: 2, owner: 'YT', task: 'Revise kitchen drawings to reflect Option B', dueDate: '2026-03-25', status: 'completed' },
      { id: 3, owner: 'PD', task: 'Request client signature on approval document', dueDate: '2026-03-20', status: 'completed' },
    ],
    notes: 'Meeting went well. Mehtas are enthusiastic about the design direction. Confirmed timeline to start construction by August.',
    durationMinutes: 90,
  },
  {
    id: 2,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    date: '2026-04-02',
    time: '10:00',
    type: 'Consultant Coordination',
    attendees: {
      internal: ['PD', 'SL'],
      external: ['Chen Structural (Lead Engineer)', 'North Structural (Partner)'],
    },
    topics: [
      'Foundation waterproofing approach',
      'Structural implications of skylight additions',
      'MEP coordination for kitchen island',
    ],
    decisions: [
      { id: 1, text: 'Skylight locations confirmed — structural will provide additional steel framing at 3 locations.', category: 'Technical' },
    ],
    actionItems: [
      { id: 1, owner: 'North Structural', task: 'Provide revised structural drawings with skylight framing', dueDate: '2026-04-15', status: 'pending' },
      { id: 2, owner: 'SL', task: 'Coordinate foundation waterproofing detail with structural', dueDate: '2026-04-10', status: 'in_progress' },
    ],
    notes: 'Foundation waterproofing detail at south elevation still needs confirmation — RFI sent to North Structural.',
    durationMinutes: 60,
  },
  {
    id: 3,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    date: '2026-04-10',
    time: '09:00',
    type: 'Internal Team',
    attendees: {
      internal: ['PD', 'SL', 'YT', 'CW'],
      external: [],
    },
    topics: [
      'DD package review before client presentation',
      'Budget status — SD phase overrun',
      'Change order #2 discussion (third design option)',
    ],
    decisions: [
      { id: 1, text: 'Change order #2 (third design option — contemporary aesthetic) to be presented to Mehtas on Apr 24. Fee: $2,800.', category: 'Financial' },
      { id: 2, text: 'DD package to be completed by Apr 22. Presentation scheduled Apr 24.', category: 'Schedule' },
    ],
    actionItems: [
      { id: 1, owner: 'CW', task: 'Complete 3D renders for DD presentation', dueDate: '2026-04-22', status: 'in_progress' },
      { id: 2, owner: 'PD', task: 'Prepare change order document for client review', dueDate: '2026-04-20', status: 'pending' },
    ],
    notes: 'SD phase ran 107% over budget (150h vs 140h estimated). Addressed by limiting DD revisions to 2 rounds.',
    durationMinutes: 45,
  },
  {
    id: 4,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    date: '2026-04-05',
    time: '11:00',
    type: 'Client Review',
    attendees: {
      internal: ['PD', 'MO'],
      external: ['James Chen (Owner)', 'Bridgewater PM'],
    },
    topics: [
      'CD phase progress review',
      'LEED Gold documentation status',
      'Rooftop amenity finalization',
    ],
    decisions: [
      { id: 1, text: 'Rooftop amenity redesign approved as per change order #2. Green roof expanded from 2,000 to 2,800 sq ft.', category: 'Design' },
      { id: 2, text: 'Target CD submission to city by June 1, 2026.', category: 'Schedule' },
    ],
    actionItems: [
      { id: 1, owner: 'MO', task: 'Update rooftop drawings with expanded green roof', dueDate: '2026-04-18', status: 'completed' },
      { id: 2, owner: 'AD', task: 'Coordinate LEED Gold documentation package', dueDate: '2026-05-01', status: 'in_progress' },
    ],
    notes: 'Client satisfied with progress. MEP pass-through of $7,200 flagged — needs to be included in next invoice.',
    durationMinutes: 75,
  },
  {
    id: 5,
    projectId: 'proj_003',
    projectName: 'Thornton Community Library',
    date: '2026-04-08',
    time: '18:00',
    type: 'Client Review',
    attendees: {
      internal: ['YT', 'PS'],
      external: ['City Librarian', 'Community Board Rep (3 attendees)'],
    },
    topics: [
      'Schematic design options A, B, C review',
      'Makerspace programming requirements',
      'Public plaza design feedback',
    ],
    decisions: [
      { id: 1, text: 'Option B selected — linear bar building with public plaza on south side. Makerspace to face street.', category: 'Design' },
      { id: 2, text: 'Bicycle parking expanded from 20 to 40 spaces per community request.', category: 'Design' },
    ],
    actionItems: [
      { id: 1, owner: 'YT', task: 'Develop Option B into full schematic package', dueDate: '2026-04-30', status: 'in_progress' },
      { id: 2, owner: 'PS', task: 'Prepare updated presentation boards', dueDate: '2026-04-28', status: 'pending' },
    ],
    notes: 'Very positive community response. Option B chosen unanimously. Sustainability features (green roof, solar) well received.',
    durationMinutes: 120,
  },
]

// ─── RFIs & Submittals (Feature 7) ────────────────────────────────────────────

export interface RFIThread {
  author: string
  date: string
  message: string
}

export interface RFI {
  id: number
  projectId: string
  projectName: string
  subject: string
  sentTo: string
  sentBy: string
  sentDate: string
  expectedResponseDate: string
  actualResponseDate: string | null
  status: 'awaiting_response' | 'answered' | 'resolved' | 'overdue'
  priority: 'high' | 'medium' | 'low'
  thread: RFIThread[]
}

export interface Submittal {
  id: number
  projectId: string
  projectName: string
  item: string
  submittedBy: string
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected' | 'revise_and_resubmit'
  reviewedBy: string | null
  reviewDate: string | null
  comments: string
}

export const RFIS: RFI[] = [
  {
    id: 1,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    subject: 'Foundation waterproofing detail at south elevation',
    sentTo: 'North Structural',
    sentBy: 'SL',
    sentDate: '2026-04-03',
    expectedResponseDate: '2026-04-10',
    actualResponseDate: null,
    status: 'overdue',
    priority: 'high',
    thread: [
      { author: 'SL', date: '2026-04-03', message: 'Please confirm the waterproofing detail at grid line 4, south elevation. Current detail shows membrane only — do we need drainage board given the grading? Grading slopes toward building at 2% from south property line.' },
    ],
  },
  {
    id: 2,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    subject: 'Steel beam sizing at skylight opening — grid 7',
    sentTo: 'North Structural',
    sentBy: 'YT',
    sentDate: '2026-04-08',
    expectedResponseDate: '2026-04-18',
    actualResponseDate: '2026-04-16',
    status: 'answered',
    priority: 'medium',
    thread: [
      { author: 'YT', date: '2026-04-08', message: 'Please confirm beam sizing for skylight opening at grid line 7. Our drawing shows W200x36 but the span has increased to 5.4m.' },
      { author: 'North Structural', date: '2026-04-16', message: 'Confirmed: upgrade to W250x45 required for 5.4m span. We will issue revised structural drawings by Apr 18.' },
    ],
  },
  {
    id: 3,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    subject: 'MEP routing conflict — Level 3 mechanical room',
    sentTo: 'MEP Associates',
    sentBy: 'MO',
    sentDate: '2026-04-12',
    expectedResponseDate: '2026-04-19',
    actualResponseDate: null,
    status: 'awaiting_response',
    priority: 'medium',
    thread: [
      { author: 'MO', date: '2026-04-12', message: 'Structural beam at grid C-3 conflicts with MEP duct routing shown on M-201. Please revise routing or confirm if beam can be penetrated. See attached coordination drawing.' },
    ],
  },
  {
    id: 4,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    subject: 'LEED documentation — materials credits section',
    sentTo: 'MEP Associates',
    sentBy: 'AD',
    sentDate: '2026-03-28',
    expectedResponseDate: '2026-04-05',
    actualResponseDate: '2026-04-04',
    status: 'resolved',
    priority: 'low',
    thread: [
      { author: 'AD', date: '2026-03-28', message: 'Requesting LEED materials credit documentation for all mechanical equipment specified on project.' },
      { author: 'MEP Associates', date: '2026-04-04', message: 'All documentation attached. All specified equipment qualifies for MR credits as requested.' },
    ],
  },
]

export const SUBMITTALS: Submittal[] = [
  {
    id: 1,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    item: 'Brick sample — warm red-brown (Acme Brick #AR-442)',
    submittedBy: 'Client via SL',
    submittedDate: '2026-03-20',
    status: 'approved',
    reviewedBy: 'SL',
    reviewDate: '2026-03-22',
    comments: 'Approved as submitted. Matches client direction from Mar 15 meeting.',
  },
  {
    id: 2,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    item: 'Kitchen island countertop — Caesarstone Statuario',
    submittedBy: 'Client',
    submittedDate: '2026-04-01',
    status: 'pending',
    reviewedBy: null,
    reviewDate: null,
    comments: '',
  },
  {
    id: 3,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    item: 'Curtain wall system — Kawneer 1600 System',
    submittedBy: 'Glazing Contractor',
    submittedDate: '2026-04-08',
    status: 'revise_and_resubmit',
    reviewedBy: 'MO',
    reviewDate: '2026-04-14',
    comments: 'Thermal break not compliant with energy model. Resubmit with Kawneer 1600UT or equivalent.',
  },
  {
    id: 4,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    item: 'Green roof assembly — ZinCo Floraset FS 50',
    submittedBy: 'Roofing Contractor',
    submittedDate: '2026-04-10',
    status: 'approved',
    reviewedBy: 'AD',
    reviewDate: '2026-04-15',
    comments: 'Approved. Meets LEED SS credit requirements.',
  },
]

// ─── Documents (Feature 8) ────────────────────────────────────────────────────

export interface DocumentRevision {
  version: number
  uploadedBy: string
  uploadedDate: string
  fileName: string
  note: string
  current: boolean
}

export interface ProjectDocument {
  id: number
  projectId: string
  projectName: string
  title: string
  type: 'Drawing Set' | 'Specification' | 'Contract' | 'Correspondence' | 'Report' | 'Other'
  revisions: DocumentRevision[]
  tags: string[]
  sharedWithClient: boolean
}

export const DOCUMENTS: ProjectDocument[] = [
  {
    id: 1,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    title: 'Schematic Design — Floor Plans',
    type: 'Drawing Set',
    revisions: [
      { version: 1, uploadedBy: 'SL', uploadedDate: '2026-02-10', fileName: 'mehta_SD_floorplans_v1.pdf', note: 'Initial schematic', current: false },
      { version: 2, uploadedBy: 'SL', uploadedDate: '2026-02-28', fileName: 'mehta_SD_floorplans_v2.pdf', note: 'Revised per client feedback Feb 24', current: false },
      { version: 3, uploadedBy: 'SL', uploadedDate: '2026-03-18', fileName: 'mehta_SD_floorplans_v3.pdf', note: 'Final SD — kitchen layout Option B incorporated', current: true },
    ],
    tags: ['Schematic Design', 'Floor Plans'],
    sharedWithClient: true,
  },
  {
    id: 2,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    title: 'Design Development — Exterior Elevations',
    type: 'Drawing Set',
    revisions: [
      { version: 1, uploadedBy: 'YT', uploadedDate: '2026-03-28', fileName: 'mehta_DD_elevations_v1.pdf', note: 'Draft DD elevations with brick cladding', current: false },
      { version: 2, uploadedBy: 'YT', uploadedDate: '2026-04-12', fileName: 'mehta_DD_elevations_v2.pdf', note: 'Updated window placement per Mar 15 decision', current: true },
    ],
    tags: ['Design Development', 'Elevations'],
    sharedWithClient: true,
  },
  {
    id: 3,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    title: 'Owner-Architect Agreement',
    type: 'Contract',
    revisions: [
      { version: 1, uploadedBy: 'PD', uploadedDate: '2025-10-20', fileName: 'mehta_OAA_signed.pdf', note: 'Executed contract — fixed fee $285,000', current: true },
    ],
    tags: ['Contract', 'Legal'],
    sharedWithClient: false,
  },
  {
    id: 4,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    title: 'Construction Documents — Site Plan',
    type: 'Drawing Set',
    revisions: [
      { version: 1, uploadedBy: 'MO', uploadedDate: '2026-03-01', fileName: 'chen_CD_siteplan_v1.pdf', note: 'Initial CD site plan for city review', current: false },
      { version: 2, uploadedBy: 'AD', uploadedDate: '2026-03-25', fileName: 'chen_CD_siteplan_v2.pdf', note: 'Updated setbacks per planning comments', current: false },
      { version: 3, uploadedBy: 'MO', uploadedDate: '2026-04-10', fileName: 'chen_CD_siteplan_v3.pdf', note: 'Final — rooftop amenity expansion incorporated', current: true },
    ],
    tags: ['Construction Documents', 'Site Plan'],
    sharedWithClient: true,
  },
]

// ─── Approvals (Feature 6) ────────────────────────────────────────────────────

export interface Approval {
  id: number
  projectId: string
  projectName: string
  title: string
  description: string
  requestedBy: string
  requestedDate: string
  respondedDate: string | null
  responseBy: string | null
  status: 'pending' | 'approved' | 'changes_requested' | 'approved_with_conditions'
  comments: string
  relatedDecisionId: number | null
}

export const APPROVALS: Approval[] = [
  {
    id: 1,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    title: 'Schematic Design Package — Client Approval',
    description: 'Complete SD package including floor plans (Option B), site plan, exterior elevations, and preliminary material board.',
    requestedBy: 'PD',
    requestedDate: '2026-03-18',
    respondedDate: '2026-03-22',
    responseBy: 'Mr. Mehta',
    status: 'approved_with_conditions',
    comments: 'Approved with one condition: confirm window sizes on east facade can accommodate future motorized blinds. PD to verify with supplier.',
    relatedDecisionId: 2,
  },
  {
    id: 2,
    projectId: 'proj_001',
    projectName: 'Mehta Residence',
    title: 'Change Order #2 — Third Design Option',
    description: 'Additional fee of $2,800 for exploration of contemporary aesthetic alternative (Change Order #2). Scope: 16 hours of design work.',
    requestedBy: 'PD',
    requestedDate: '2026-04-15',
    respondedDate: null,
    responseBy: null,
    status: 'pending',
    comments: '',
    relatedDecisionId: null,
  },
  {
    id: 3,
    projectId: 'proj_002',
    projectName: 'Chen Commercial Complex',
    title: 'Rooftop Amenity Redesign — Change Order #2',
    description: 'Expanded green roof from 2,000 to 2,800 sq ft. Additional structural and MEP coordination required. Fee: $7,000.',
    requestedBy: 'PD',
    requestedDate: '2026-01-15',
    respondedDate: '2026-01-20',
    responseBy: 'James Chen',
    status: 'approved',
    comments: 'Approved. Proceed immediately.',
    relatedDecisionId: null,
  },
]

// ─── Capacity Forecast (Feature 4) ────────────────────────────────────────────

export interface CapacityWeek {
  weekStart: string
  plannedHours: number
  capacityHours: number
  utilization: number
  projects: string[]
}

export interface MemberCapacity {
  userId: string
  userName: string
  initials: string
  weeks: CapacityWeek[]
}

const makeWeeks = (
  startDates: string[],
  utils: number[],
  projectSets: string[][],
): CapacityWeek[] =>
  startDates.map((weekStart, i) => {
    const u = utils[i]
    const planned = Math.round((u / 100) * 40)
    return { weekStart, plannedHours: planned, capacityHours: 40, utilization: u, projects: projectSets[i] ?? [] }
  })

const WEEK_STARTS = [
  '2026-04-21', '2026-04-28', '2026-05-05', '2026-05-12',
  '2026-05-19', '2026-05-26', '2026-06-02', '2026-06-09',
  '2026-06-16', '2026-06-23',
]

export const CAPACITY_FORECAST: MemberCapacity[] = [
  {
    userId: 'tm_001', userName: 'Pamir Dogan', initials: 'PD',
    weeks: makeWeeks(WEEK_STARTS,
      [82, 80, 78, 75, 70, 65, 62, 60, 58, 55],
      [
        ['Mehta Residence', 'Chen Complex'],
        ['Mehta Residence', 'Chen Complex'],
        ['Chen Complex', 'Forest Hill'],
        ['Chen Complex', 'Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
  {
    userId: 'tm_002', userName: 'Sara Levi', initials: 'SL',
    weeks: makeWeeks(WEEK_STARTS,
      [105, 108, 102, 96, 90, 88, 82, 80, 76, 72],
      [
        ['Mehta Residence', 'Forest Hill'],
        ['Mehta Residence', 'Forest Hill'],
        ['Mehta Residence', 'Forest Hill'],
        ['Mehta Residence', 'Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
  {
    userId: 'tm_003', userName: 'Marcus Osei', initials: 'MO',
    weeks: makeWeeks(WEEK_STARTS,
      [78, 80, 82, 80, 78, 76, 75, 73, 70, 68],
      [
        ['Chen Complex', 'Lakeside Penthouse'],
        ['Chen Complex', 'Lakeside Penthouse'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex', 'Forest Hill'],
        ['Chen Complex', 'Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
  {
    userId: 'tm_004', userName: 'Yuki Tanaka', initials: 'YT',
    weeks: makeWeeks(WEEK_STARTS,
      [85, 83, 80, 78, 75, 73, 70, 68, 65, 62],
      [
        ['Mehta Residence', 'Library'],
        ['Mehta Residence', 'Library'],
        ['Library', 'Forest Hill'],
        ['Library', 'Forest Hill'],
        ['Library', 'Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
  {
    userId: 'tm_005', userName: 'Amara Diallo', initials: 'AD',
    weeks: makeWeeks(WEEK_STARTS,
      [72, 70, 68, 65, 63, 60, 58, 55, 52, 50],
      [
        ['Chen Complex', 'Harbourfront Bistro'],
        ['Chen Complex', 'Harbourfront Bistro'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
        ['Chen Complex'],
      ]),
  },
  {
    userId: 'tm_006', userName: 'Chen Wei', initials: 'CW',
    weeks: makeWeeks(WEEK_STARTS,
      [88, 85, 82, 80, 78, 75, 72, 70, 68, 65],
      [
        ['Mehta Residence', 'Chen Complex'],
        ['Mehta Residence', 'Chen Complex'],
        ['Chen Complex', 'Forest Hill'],
        ['Chen Complex', 'Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
  {
    userId: 'tm_007', userName: 'Priya Sharma', initials: 'PS',
    weeks: makeWeeks(WEEK_STARTS,
      [65, 62, 60, 58, 55, 52, 50, 48, 45, 45],
      [
        ['Library', 'Harbourfront Bistro'],
        ['Library', 'Harbourfront Bistro'],
        ['Library'],
        ['Library'],
        ['Library'],
        ['Library'],
        ['Library'],
        ['Library'],
        ['Library'],
        ['Library'],
      ]),
  },
  {
    userId: 'tm_008', userName: 'James Okonkwo', initials: 'JO',
    weeks: makeWeeks(WEEK_STARTS,
      [60, 62, 65, 68, 70, 68, 65, 62, 60, 58],
      [
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
        ['Forest Hill'],
      ]),
  },
]

// ─── Billing Schedules (Feature 3) ───────────────────────────────────────────

export interface PhaseFee {
  phase: string
  percentage: number
  fee: number
  status: 'invoiced' | 'partial' | 'upcoming' | 'draft'
  billedToDate?: number
  invoiceId?: string
}

export interface BillingSchedule {
  projectId: string
  autoDraftEnabled: boolean
  triggerThreshold: number
  totalFee: number
  billedToDate: number
  remainingToBill: number
  phaseFees: PhaseFee[]
}

export const BILLING_SCHEDULES: BillingSchedule[] = [
  {
    projectId: 'proj_001',
    autoDraftEnabled: true,
    triggerThreshold: 90,
    totalFee: 285000,
    billedToDate: 171000,
    remainingToBill: 114000,
    phaseFees: [
      { phase: 'Pre-Design', percentage: 5, fee: 14250, status: 'invoiced', invoiceId: 'INV-2026-001' },
      { phase: 'Schematic Design', percentage: 20, fee: 57000, status: 'invoiced', invoiceId: 'INV-2026-007', billedToDate: 57000 },
      { phase: 'Design Development', percentage: 25, fee: 71250, status: 'partial', billedToDate: 42750, invoiceId: 'INV-2026-007' },
      { phase: 'Construction Documents', percentage: 35, fee: 99750, status: 'upcoming' },
      { phase: 'Construction Administration', percentage: 15, fee: 42750, status: 'upcoming' },
    ],
  },
  {
    projectId: 'proj_002',
    autoDraftEnabled: true,
    triggerThreshold: 90,
    totalFee: 1200000,
    billedToDate: 920000,
    remainingToBill: 280000,
    phaseFees: [
      { phase: 'Pre-Design', percentage: 5, fee: 60000, status: 'invoiced' },
      { phase: 'Schematic Design', percentage: 15, fee: 180000, status: 'invoiced', invoiceId: 'INV-2026-009' },
      { phase: 'Design Development', percentage: 20, fee: 240000, status: 'invoiced', invoiceId: 'INV-2026-002' },
      { phase: 'Construction Documents', percentage: 40, fee: 480000, status: 'partial', billedToDate: 440000, invoiceId: 'INV-2026-004' },
      { phase: 'Construction Administration', percentage: 20, fee: 240000, status: 'upcoming' },
    ],
  },
]
