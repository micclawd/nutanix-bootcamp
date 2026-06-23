// Nutanix concept dataset — based on publicly available Nutanix official documentation.
// All facts are drawn from the Nutanix Bible, Nutanix Port and Info Portal, and
// official docs portal (portal.nutanix.com / documentation.nutanix.com).

export type Difficulty = "Foundational" | "Intermediate" | "Advanced";

export interface Concept {
  id: string;
  term: string;
  module: ModuleId;
  difficulty: Difficulty;
  short: string; // one-sentence summary
  detail: string; // paragraph explanation
  keyFacts: string[];
  networkBridge?: string; // mapping for network-experienced learners
  gotcha?: string; // common pitfall / tip
  example?: string;
  docRef?: string; // doc reference label
}

export type ModuleId =
  | "foundations"
  | "storage"
  | "ahv-networking"
  | "prism"
  | "flow"
  | "data-services"
  | "operations"
  | "hybrid-cloud";

export interface Module {
  id: ModuleId;
  title: string;
  tagline: string;
  icon: string; // lucide icon name
  color: string; // tailwind color base e.g. "emerald"
  description: string;
}

export const modules: Module[] = [
  {
    id: "foundations",
    title: "Platform Foundations",
    tagline: "HCI, CVM, AHV & cluster architecture",
    icon: "Server",
    color: "emerald",
    description:
      "The architectural building blocks of the Nutanix Cloud Platform: how compute, storage, and management converge onto a single distributed fabric. This module covers the Controller VM, the hypervisor layer, the cluster concept, and the Acropolis Operating System (AOS) that ties everything together.",
  },
  {
    id: "storage",
    title: "Distributed Storage Fabric",
    tagline: "DSF, storage pools, containers, RF & EC-X",
    icon: "Database",
    color: "sky",
    description:
      "The Distributed Storage Fabric (DSF) turns locally attached drives in every node into a single, resilient, shared storage pool. This module covers storage pools, storage containers, the OpLog, the extent store, replication factor (RF), erasure coding (EC-X), and the inline data-reduction pipeline.",
  },
  {
    id: "ahv-networking",
    title: "AHV Networking",
    tagline: "OVS, bridges, VLANs, IPAM & bonds",
    icon: "Network",
    color: "violet",
    description:
      "How networking works inside an AHV cluster. This module is the deepest networking module and is intentionally mapped to concepts you already know from traditional switching: Open vSwitch (OVS), bridge interfaces, VLAN tagging modes, IP address management (IPAM), bond modes, and the separation of management, storage, and VM traffic.",
  },
  {
    id: "prism",
    title: "Prism Management",
    tagline: "Prism Element vs Prism Central",
    icon: "LayoutDashboard",
    color: "amber",
    description:
      "Prism is the management plane. Prism Element manages a single cluster; Prism Central manages many clusters as one. This module covers the split, image management, VM lifecycle, alerts, analysis, and the role-based access control (RBAC) model.",
  },
  {
    id: "flow",
    title: "Flow Network Virtualization",
    tagline: "VPCs, micro-segmentation, floating IPs",
    icon: "Shield",
    color: "rose",
    description:
      "Flow is Nutanix's network virtualization stack. This is the module that most directly extends traditional networking concepts into the software-defined world: Flow Virtual Networking (VPCs, subnets, floating IPs, NAT), Flow Network Security (micro-segmentation policies), and Flow Virtual DNS.",
  },
  {
    id: "data-services",
    title: "Data Services",
    tagline: "Files, Volumes, Objects, Era",
    icon: "HardDrive",
    color: "teal",
    description:
      "Nutanix exposes storage through multiple first-class services: Nutanix Files (NAS), Nutanix Volumes (block), Nutanix Objects (S3-compatible), and Nutanix Era (Database-as-a-Service). This module covers what each one is, when to use it, and how it relates to the underlying DSF.",
  },
  {
    id: "operations",
    title: "Operations & Automation",
    tagline: "Calm, Move, Karbon, Xi Leap",
    icon: "Workflow",
    color: "indigo",
    description:
      "Day-2 operations tooling. Nutanix Calm orchestrates application blueprints and runbooks; Nutanix Move migrates VMs from legacy hypervisors; Nutanix Karbon provisions Kubernetes; Xi Leap provides DR-as-a-service. This module covers what each one does and how they fit together.",
  },
  {
    id: "hybrid-cloud",
    title: "Hybrid & Multi-Cloud",
    tagline: "NC2 on AWS / Azure, Xi Cloud",
    icon: "Cloud",
    color: "orange",
    description:
      "Running Nutanix outside your datacenter. NC2 (Nutanix Cloud Clusters) deploys Nutanix on AWS and Azure with the same Prism management plane. Xi Cloud services extend workloads to Nutanix-hosted infrastructure. This module covers NC2 deployment models, networking, and billing.",
  },
];

export const concepts: Concept[] = [
  // ───────────────────────────── FOUNDATIONS ─────────────────────────────
  {
    id: "hci",
    term: "Hyperconverged Infrastructure (HCI)",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "An architecture that collapses compute, storage, and networking into a single software-defined appliance, eliminating the traditional SAN.",
    detail:
      "Nutanix HCI collapses the traditional three-tier datacenter (compute servers, storage array, and SAN network) into a single x86 appliance running the Acropolis Operating System (AOS). Every node runs a hypervisor (AHV by default), hosts user VMs, and contributes local disks to a globally addressable storage pool. The cluster grows linearly — add a node, add both compute and storage in a fixed ratio. There is no SAN, no LUN masking, and no FC switching; storage requests are serviced by the local Controller VM (CVM) and, when needed, by CVMs on peer nodes over the 10/25 GbE storage network.",
    keyFacts: [
      "Compute + storage + virtualization in one box; scales by adding nodes",
      "No external SAN, no FC/iSCSI switching for the storage plane",
      "AOS software runs on every node, providing the distributed storage fabric",
      "Linear scale-out — each node adds a predictable compute + storage delta",
    ],
    networkBridge:
      "Think of HCI as collapsing the entire access-tier switch + storage array + compute rack into one box. The 10/25 GbE fabric inside an HCI cluster replaces both your converged network adapter and your SAN front-end ports.",
    gotcha:
      "HCI is not 'virtualization with local disks' — the disks are local physically but globally addressable through the CVM. A VM can read/write blocks that physically live on another node without ever mounting an iSCSI LUN.",
    example:
      "A 4-node NX-3460-G6 cluster provides ~96 vCPU, 768 GB RAM, and ~40 TB usable storage in 2U of rack space — no separate storage rack required.",
    docRef: "Nutanix Bible — 'Cluster Architecture'",
  },
  {
    id: "cvm",
    term: "Controller VM (CVM)",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "A special-purpose VM on every node that owns all local disks and serves iSCSI to the hypervisor.",
    detail:
      "Every Nutanix node runs exactly one Controller VM. The CVM takes ownership of the node's local disks (via PCIe passthrough on AHV, or RDM/paravirtualized SCSI on ESXi) and exposes them back to the hypervisor as iSCSI targets. The hypervisor then boots the user VMs from those iSCSI-backed datastores. Because every CVM runs the Stargate process, the cluster as a whole behaves like a distributed storage array. CVMs talk to each other over the storage network to replicate writes, serve remote reads, and rebalance data. If a CVM reboots, the local hypervisor keeps serving VMs from peer CVMs over the network.",
    keyFacts: [
      "One CVM per node; runs the Stargate storage process",
      "Owns local disks and exposes them as iSCSI back to the hypervisor",
      "Lives on the storage network (typically 10/25 GbE, dedicated or shared)",
      "Default CVM sizing: 32 GB RAM / 16 vCPU on modern nodes (varies by model)",
    ],
    networkBridge:
      "Treat the CVM like a virtual storage controller that happens to live on the same box as the host. It is the iSCSI target for that node's hypervisor — same protocol you'd use to talk to a NetApp LUN, just looped back locally.",
    gotcha:
      "A rebooted CVM does NOT crash VMs on its host. The hypervisor fails over its iSCSI sessions to peer CVMs. Plan storage-network bandwidth for this failover scenario.",
    example:
      "AHV host 'A' boots its VMs from iSCSI target 192.168.5.10 (the local CVM). If that CVM restarts, AHV redirects IO to 192.168.5.11 (the CVM on host B) without dropping the VMs.",
    docRef: "Nutanix Bible — 'Controller VM (CVM)'",
  },
  {
    id: "ahv",
    term: "AHV (Acropolis Hypervisor)",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "Nutanix's free, license-free, CentOS-based KVM hypervisor — installed and managed as part of AOS.",
    detail:
      "AHV is Nutanix's native hypervisor. It is a hardened, minimal CentOS Linux running KVM, with QEMU for device emulation and a custom kernel tuned for HCI workloads. AHV ships with AOS at no extra license cost and is managed entirely from Prism — there is no vCenter, no separate hypervisor manager, and no separate patching pipeline. AHV uses Open vSwitch (OVS) for VM networking and supports the same VM features you'd expect from a Tier-1 hypervisor: vCPU hot-add, memory hot-add, live migration (called 'AHV Live Migration'), snapshots, clones, and storage live-disk-migrate. ESXi and Hyper-V remain supported as alternatives on most Nutanix hardware.",
    keyFacts: [
      "KVM-based, CentOS-derived, no separate license cost",
      "Managed entirely through Prism; no vCenter equivalent required",
      "Uses Open vSwitch (OVS) for VM networking",
      "Supports AHV Live Migration (analogous to vMotion)",
      "Patched through AOS upgrades — one button in Prism",
    ],
    networkBridge:
      "If you've run KVM on Linux, AHV will feel familiar: same KVM, same libvirt under the hood, same OVS. The difference is that Nutanix curates the kernel, ships the drivers, and exposes management through Prism instead of virsh.",
    gotcha:
      "AHV has no equivalent of the VMware vSwitch 'port group' GUI. Networking is configured at the OVS bridge level via Prism (or acli) — VLANs are properties of the bridge, not separate objects.",
    example:
      "To create a VM network on VLAN 100 in AHV, you create (or use) a 'network' object that references bridge br0 with VLAN 100 tagging. The VM's vNIC attaches to that network object.",
    docRef: "AHV Administration Guide",
  },
  {
    id: "aos",
    term: "AOS / Acropolis Operating System",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "The Nutanix distributed operating system that runs the CVM, the hypervisor, and the storage fabric.",
    detail:
      "AOS is the unifying software layer installed on every Nutanix node. It is composed of three pillars: Acropolis (the distributed storage and VM management service running inside the CVM), Prism (the management plane), and the hypervisor layer (AHV, ESXi, or Hyper-V). AOS handles cluster membership, distributed metadata, replication, tiering, dedup, compression, erasure coding, and lifecycle (NCC, firmware, hypervisor patches). Upgrading AOS in one operation upgrades the hypervisor, the CVM, and the management plane together — this is a major operational difference vs traditional 3-tier stacks where each layer has its own patching cycle.",
    keyFacts: [
      "Three pillars: Acropolis (storage/VM), Prism (management), Hypervisor",
      "Single upgrade path — one click upgrades CVM + hypervisor + firmware",
      "Includes NCC (Nutanix Cluster Check) for health validation",
      "Current LTS train is AOS 6.x; Long-Term Service (LTS) and Short-Term Service (STS) releases",
    ],
    networkBridge:
      "AOS upgrade is like a single-button push that simultaneously patches ESXi, vCenter, your SAN controller, and your switch firmware — all coordinated, all version-tested together.",
    gotcha:
      "Always run NCC before and after an AOS upgrade. NCC validates network config, firmware compatibility, and storage health. Skipping it is the #1 cause of failed upgrades.",
    docRef: "AOS Upgrade Guide",
  },
  {
    id: "cluster",
    term: "Cluster",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "A set of 1+ Nutanix nodes (minimum 3 for production) that pool resources into one logical platform.",
    detail:
      "A Nutanix cluster is the management and fault boundary. Minimum production cluster size is 3 nodes; the recommended size for most enterprise workloads is 4+ nodes to tolerate one node failure with RF=2 still satisfied. All nodes in a cluster share a single storage pool, a single metadata space, and a single Prism Element endpoint. Clusters are grouped under Prism Central for cross-cluster management. Node failures are detected by cluster heartbeat (CVMs ping each other over the storage network); the metadata ring rebalances automatically when membership changes.",
    keyFacts: [
      "Minimum 3 nodes for production (1-node clusters allowed for ROBO/test)",
      "All nodes share one storage pool and one metadata space",
      "Failure domain: a cluster tolerates RF-1 node failures before data loss",
      "Multiple clusters per site; clusters can be added to Prism Central",
    ],
    networkBridge:
      "A cluster is to a Nutanix platform what a VRF or routing instance is to a router: a self-contained boundary. Workloads inside a cluster share state; workloads across clusters must be explicitly linked.",
    gotcha:
      "A 3-node RF=2 cluster can survive ONE node failure. Two simultaneous node failures = potential data loss. For mission-critical workloads, run 4+ nodes and/or use RF=3.",
    docRef: "Cluster Operations Guide",
  },
  {
    id: "rf-factor",
    term: "Replication Factor (RF)",
    module: "foundations",
    difficulty: "Foundational",
    short:
      "The number of copies of every storage block written across the cluster — typically RF2 or RF3.",
    detail:
      "Every write to DSF is synchronously replicated across N independent nodes, where N is the Replication Factor. RF2 (default) writes two copies on two different nodes; RF3 writes three copies on three different nodes. The cluster must therefore contain at least RF+1 nodes to survive a node failure without losing data redundancy (e.g. RF2 needs 3 nodes minimum so that after losing 1, the data still has 2 copies). Replicas are placed using a 'disk balanced' algorithm that considers node, block, and disk failure domains — replicas are never co-located on the same node or the same disk. RF is a property of the storage container and can be changed at any time; raising RF triggers a background re-replication that consumes storage network bandwidth.",
    keyFacts: [
      "RF2 = 2 copies (default); RF3 = 3 copies (mission-critical)",
      "Minimum nodes = RF + 1 (RF2 → 3 nodes, RF3 → 4 nodes)",
      "Replicas always on different nodes; never on same disk or block",
      "RF is set per storage container; can be changed live",
    ],
    networkBridge:
      "Think of RF as RAID-1 across network-attached nodes instead of across local disks. RF2 ≈ RAID-1 with 2 mirrors; RF3 ≈ 3-way mirror.",
    gotcha:
      "Usable capacity with RF2 = ~50% of raw. With RF3 = ~33% of raw. Plan capacity accordingly — adding RF3 to a near-full RF2 cluster can cause out-of-space conditions during re-replication.",
    docRef: "Storage Administration — 'Replication Factor'",
  },

  // ───────────────────────────── STORAGE (DSF) ─────────────────────────────
  {
    id: "dsf",
    term: "Distributed Storage Fabric (DSF)",
    module: "storage",
    difficulty: "Foundational",
    short:
      "The software layer that turns every node's local disks into a single, shared, resilient storage pool.",
    detail:
      "DSF is the umbrella name for Nutanix's distributed storage stack. Every CVM runs a Stargate process that owns its local disks and serves iSCSI to the local hypervisor. Writes are accepted by the local Stargate, replicated to peer Stargates (per RF), journaled in the OpLog, and eventually flushed to the Extent Store. Reads are served from the local Stargate whenever possible (locality), and from a peer Stargate otherwise. The cluster's metadata (what blocks belong to what VM, where the replicas live, what's deduped/compressed) lives in a distributed ring called 'Cassandra' (Medusa on larger clusters) — every CVM owns a slice of that ring.",
    keyFacts: [
      "Stargate = per-CVM storage service; Cassandra/Medusa = metadata ring",
      "Writes are replicated synchronously per RF before ack to the VM",
      "OpLog (journal) absorbs random writes; Extent Store holds the deduped, compressed log-structured data",
      "Read locality: ~95%+ of reads served from local Stargate",
    ],
    networkBridge:
      "DSF is a distributed RAID over the storage network. The 10/25 GbE storage network must be sized for: replication traffic, peer reads on local miss, and rebalancing during node failures.",
    gotcha:
      "The storage network is not optional. A saturated or misconfigured storage network is the #1 cause of cluster-wide latency spikes — every VM IO depends on it.",
    docRef: "Nutanix Bible — 'Distributed Storage Fabric'",
  },
  {
    id: "storage-pool",
    term: "Storage Pool",
    module: "storage",
    difficulty: "Foundational",
    short:
      "A logical grouping of all physical disks of the same type across all nodes in a cluster.",
    detail:
      "A storage pool is the lowest layer of DSF abstraction. By default, each cluster has one storage pool per disk type: one for SSDs (Tier-0 / hot tier) and one for HDDs (Tier-1 / cold tier). All disks of that type from all nodes are added to the pool. You cannot create multiple storage pools of the same disk tier in modern AOS — the pool is essentially 'all the disks of this type in the cluster'. Storage containers (the next layer up) are carved out of storage pools. The pool itself is invisible to VMs; VMs live on storage containers.",
    keyFacts: [
      "One storage pool per disk tier per cluster (default behavior)",
      "SSD pool = Tier-0 (hot); HDD pool = Tier-1 (cold)",
      "Storage containers are carved out of storage pools",
      "Adding a node adds its disks to the pool automatically",
    ],
    networkBridge:
      "Storage pool ≈ a RAID array's physical disk group. You don't present a RAID group to a host directly — you carve LUNs out of it. Same here: pool = raw capacity, container = the presented unit.",
    gotcha:
      "Don't try to create per-department storage pools — the platform doesn't work that way. Use storage containers (one per tier of service) and use quota/AD controls for tenancy.",
    docRef: "Storage Administration — 'Storage Pools'",
  },
  {
    id: "storage-container",
    term: "Storage Container (Unified Storage)",
    module: "storage",
    difficulty: "Foundational",
    short:
      "A logical partition of a storage pool that holds VM disks and is the unit of RF, dedup, compression, and AD policy.",
    detail:
      "A storage container is the user-facing storage object. Each container has its own RF, dedup/compression/EC-X settings, encryption setting, and (optionally) an Active Directory-resident access-control policy. VM disks (vDisks) live inside a container; erasure coding and dedup/compression run at the container level. Modern AOS refers to these as 'Unified Storage Containers' because the same container can hold files, blocks, and objects — the protocol is determined by the service exposing it (Files, Volumes, Objects), not by the container itself. A typical cluster has 2–4 containers: e.g. 'Default-RF2', 'Mission-Critical-RF3', 'Archive-EC-X', 'Dev-Thin'.",
    keyFacts: [
      "One container = one RF + one set of data-reduction policies",
      "VM vDisks live inside containers",
      "AD-based access control optional per container",
      "Same container can serve Files, Volumes, and Objects (Unified Storage)",
    ],
    networkBridge:
      "Storage container ≈ a LUN group with a policy attached. Where a NetApp volume has a SnapMirror policy and a dedup scope, a Nutanix container has RF and EC-X settings.",
    gotcha:
      "Changing RF on a container triggers background re-replication that can saturate the storage network for hours. Schedule it during a maintenance window.",
    docRef: "Storage Administration — 'Storage Containers'",
  },
  {
    id: "oplog",
    term: "OpLog (Operation Log)",
    module: "storage",
    difficulty: "Intermediate",
    short:
      "A SSD-resident journal that absorbs synchronous writes before they are flushed to the Extent Store.",
    detail:
      "The OpLog is the write-absorbing layer of DSF. Every synchronous write from a VM is acked to the guest only after it has been written to the local OpLog AND replicated to peer OpLogs on (RF-1) other nodes — this guarantees durability even before the data reaches the Extent Store. The OpLog is SSD-resident for low latency (sub-millisecond ack). Once a write is in the OpLog, a background process coalesces, dedupes, and compresses it before flushing it to the Extent Store. The OpLog is sized per node based on SSD capacity; it is a circular log, so old entries are invalidated as data ages out to the Extent Store.",
    keyFacts: [
      "SSD-resident; absorbs random writes for low-latency ack",
      "Synchronous replication to peer OpLogs before ack",
      "Coalesces + dedupes + compresses before flushing to Extent Store",
      "Sized per node; circular log",
    ],
    networkBridge:
      "OpLog is conceptually a write-back cache with battery-backed replication — like a NetApp NVRAM card, except the redundancy is across the network rather than inside a single controller.",
    gotcha:
      "If you run workloads with very high synchronous-write rates (e.g. OLTP databases), monitor OpLog utilization. A saturated OpLog forces writes to spill directly to the Extent Store, increasing latency.",
    docRef: "Nutanix Bible — 'OpLog'",
  },
  {
    id: "extent-store",
    term: "Extent Store",
    module: "storage",
    difficulty: "Intermediate",
    short:
      "The persistent log-structured store on SSD and HDD that holds deduped, compressed, EC-X'd data.",
    detail:
      "The Extent Store is the 'main' storage layer of DSF. After writes are absorbed by the OpLog, a background 'Curator' job coalesces them into extents (4 KB logical blocks), dedupes them against known fingerprints, compresses them with LZ4 (or inline with heavier algorithms), optionally erasure-codes them, and persists the result to the Extent Store. The Extent Store is log-structured: data is appended, never overwritten in place. Garbage collection (space reclamation) is handled by Curator scans. The Extent Store spans both SSD (Tier-0) and HDD (Tier-1); cold data is automatically demoted to HDD, hot data is promoted back to SSD.",
    keyFacts: [
      "Log-structured: writes are appended, not over-written in place",
      "Extents = 4 KB logical blocks (the unit of dedup/compression)",
      "Holds deduped, compressed, EC-X'd data",
      "Curator job runs periodically for space reclamation & tiering",
    ],
    networkBridge:
      "Extent Store ≈ a write-once object store with a background defrag process. Don't expect traditional LUN overwrite semantics — TRIM/UNMAP is handled by Curator, not by the guest.",
    gotcha:
      "Thin-provisioned VMs that delete lots of files internally don't actually free space until the guest issues TRIM/UNMAP AND Curator runs. Enable TRIM in the guest for thin-provisioned vDisks.",
    docRef: "Nutanix Bible — 'Extent Store'",
  },
  {
    id: "ec-x",
    term: "Erasure Coding (EC-X)",
    module: "storage",
    difficulty: "Intermediate",
    short:
      "A space-efficient redundancy scheme (Reed-Solomon) that replaces RF for cold/warm data, saving ~25-50% capacity.",
    detail:
      "EC-X is Nutanix's erasure-coding implementation. It runs as a background job: it takes an RF2 or RF3 data set, stripes it across the cluster using a Reed-Solomon scheme, and replaces the RF replicas with parity stripes. Two profiles are common: EC-X 4+2 (4 data + 2 parity, requires 6+ nodes) and EC-X 2+1 (2 data + 1 parity, requires 3+ nodes). The capacity savings: a 4+2 stripe consumes 1.5x raw vs RF2's 2x raw — a 25% saving. EC-X is best for cold/warm data (backup, archive, file shares) because reads incur stripe reconstruction overhead. It runs every ~90 minutes via Curator; only data that hasn't been recently modified is converted.",
    keyFacts: [
      "Profiles: 4+2 (6+ nodes), 2+1 (3+ nodes), 8+2, 16+4 (larger clusters)",
      "Converts RF2/RF3 to parity — saves 25-50% raw capacity",
      "Runs every ~90 min via Curator on cold data only",
      "Best for: file shares, backups, archive; avoid for OLTP hot data",
    ],
    networkBridge:
      "EC-X ≈ RAID-6 across the network instead of across local disks. A 4+2 stripe tolerates 2 failures, just like RAID-6 — but the 'disks' are nodes.",
    gotcha:
      "EC-X requires the cluster to be at least N+M nodes (e.g. 4+2 needs 6 nodes). On smaller clusters, EC-X silently falls back to RF.",
    docRef: "Storage Administration — 'Erasure Coding'",
  },
  {
    id: "data-reduction",
    term: "Inline Data Reduction (Dedup + Compression)",
    module: "storage",
    difficulty: "Intermediate",
    short:
      "Inline deduplication and LZ4 compression applied to every write before it lands in the Extent Store.",
    detail:
      "DSF applies two data-reduction technologies inline. Deduplication: every 4 KB block is fingerprinted (SHA-1 hash) and compared against a per-container fingerprint map. If the fingerprint matches an existing block, the new write is discarded and a metadata pointer is created. Compression: blocks are compressed with LZ4 before being written to the Extent Store. Both operations happen after the OpLog absorbs the write but before flush — they're invisible to the VM. Inline dedup is on by default for AHV clusters in modern AOS; capacity savings depend on workload (full-clone VDI gets 60-90%; generic VM workloads get 10-40%). Post-process dedup is also available for legacy configurations.",
    keyFacts: [
      "Inline dedup: SHA-1 fingerprint per 4 KB block, per-container map",
      "Inline compression: LZ4 (lossless, fast)",
      "Both run transparently after OpLog, before Extent Store flush",
      "Typical savings: 30-60% on mixed workloads, 60-90% on VDI",
    ],
    networkBridge:
      "Compression + dedup is conceptually identical to what a modern all-flash array does — just distributed across nodes. The dedup scope is per-container, so plan your containers around dedup domains.",
    gotcha:
      "Dedup is fingerprint-based, so two blocks with the same content but different LBA will dedup — good for clones, but don't assume dedup will save you on encrypted volumes (ciphertext won't match).",
    docRef: "Storage Administration — 'Data Reduction'",
  },
  {
    id: "curator",
    term: "Curator",
    module: "storage",
    difficulty: "Advanced",
    short:
      "The background DSF job runner that handles dedup, compression, EC-X, tiering, and space reclamation.",
    detail:
      "Curator is the MapReduce-style job framework inside every CVM. It runs continuously on a schedule (default: every 90 minutes for full scans; smaller scans more frequently). Curator jobs include: deduplication (fingerprint post-processing for legacy configs), EC-X conversion, capacity tiering (hot→cold, cold→hot), space reclamation (TRIM/UNMAP), data rebalancing after node add/remove, and RF re-replication after failures. Curator scans are throttled to avoid impacting foreground IO; the throttle is auto-tuned based on cluster load. You can monitor Curator jobs from Prism → Analysis → 'Curator Scan' and can force a partial scan from the acli (advanced).",
    keyFacts: [
      "MapReduce-style job framework inside every CVM",
      "Default full scan: every ~90 min; partial scans more frequent",
      "Handles: dedup, EC-X, tiering, space reclamation, rebalance, RF",
      "Auto-throttled to protect foreground IO",
    ],
    networkBridge:
      "Curator ≈ a built-in SAN background process (NetApp's 'Active IQ', Pure's 'reduction estimator') — but scheduled across the cluster rather than per-controller.",
    gotcha:
      "Curator jobs can briefly spike storage network bandwidth on large clusters during rebalance. Avoid adding multiple nodes simultaneously to a near-full cluster.",
    docRef: "Nutanix Bible — 'Curator'",
  },

  // ───────────────────────────── AHV NETWORKING ─────────────────────────────
  {
    id: "ovs",
    term: "Open vSwitch (OVS) on AHV",
    module: "ahv-networking",
    difficulty: "Foundational",
    short:
      "The software switch that connects VM vNICs to physical uplinks on every AHV host.",
    detail:
      "AHV uses Open vSwitch (OVS) as its virtual switch. OVS is a production-grade, multilayer software switch originally developed by Nicira/VMware and now Linux Foundation-hosted. On AHV, every host runs a single OVS instance with one or more bridges (br0, br1, ahv-br- followed by an interface index). VM vNICs plug into bridges; bridges have one or more physical uplink ports. OVS supports the standard switching features you'd expect: VLAN access/trunk ports, LACP bonds (active-backup by default), QinQ, sFlow, NetFlow/vFlow, OpenFlow 1.x, and QoS via tc. Configuration is exposed via Prism (the user-facing layer) but stored as OVSDB records that you can also inspect with `ovs-vsctl show` from the AHV shell.",
    keyFacts: [
      "OVS is the only vSwitch on AHV (no VDS/VSS equivalent)",
      "Bridges (br0, br1, …) connect VM vNICs to physical uplinks",
      "Standard features: VLANs, LACP, QinQ, sFlow, OpenFlow, QoS",
      "Configurable from Prism or `ovs-vsctl` from the AHV shell",
    ],
    networkBridge:
      "OVS is the open-source equivalent of VMware's VDS — same concept (port groups, VLAN tags, NIC teaming), different implementation. If you've ever run OVS on a Linux KVM host, AHV is the same toolchain.",
    gotcha:
      "Don't manually edit OVS config with `ovs-vsctl` on a running cluster — Prism will overwrite it on the next network reconfigure. Use Prism or acli for any persistent change.",
    example:
      "On a fresh AHV install, `ovs-vsctl show` shows bridge `br0` with uplink `br0-up` (a bond of `eth0`+`eth1`) and the CVM's internal interface `br0`.",
    docRef: "AHV Networking Guide",
  },
  {
    id: "bridges",
    term: "AHV Bridges (br0, br1, …)",
    module: "ahv-networking",
    difficulty: "Foundational",
    short:
      "OVS bridge objects that bind VM vNICs to physical uplinks; the unit of VLAN configuration on AHV.",
    detail:
      "On AHV, a 'bridge' is an OVS bridge object. By default, AHV creates `br0` (sometimes named `br0-up` for the bond underneath) for VM traffic and (optionally) `br1` for a secondary network. Each bridge has: (1) one or more physical uplinks (often as a bond for redundancy), (2) zero or more VM vNICs attached, (3) zero or more VLAN-tagged 'networks' (Prism object). When you create a VM network on VLAN 100, you're creating an OVS port-group equivalent: VM vNICs attached to that network get their traffic tagged with VLAN 100 on egress out the uplink. Bridging vs routing: bridges forward L2; for L3 between bridges, traffic must exit the host and be routed upstream.",
    keyFacts: [
      "br0 = primary bridge (VM traffic); br1 = secondary (optional)",
      "Uplinks under a bridge are typically bonded (br0-up = bond of eth0+eth1)",
      "VM networks = VLAN-tagged port groups on top of a bridge",
      "CVM traffic (192.168.5.x by default) usually lives on br0 or a dedicated internal bridge",
    ],
    networkBridge:
      "br0 ≈ a VMware VDS port group bound to a NIC team. The 'network' object on top of br0 with VLAN=100 ≈ a port group with VLAN 100 tagging.",
    gotcha:
      "All VM traffic egresses the same uplink bond by default. To physically separate VM traffic from storage traffic, configure the uplink bond to carry VLANs and use VLAN tagging rather than trying to put storage on a separate bridge.",
    docRef: "AHV Networking — 'Bridge Configuration'",
  },
  {
    id: "vlan-modes",
    term: "VLAN Tagging Modes (Access / Trunk / Native)",
    module: "ahv-networking",
    difficulty: "Intermediate",
    short:
      "How AHV tags (or doesn't tag) VM egress traffic — analogous to switchport access vs trunk modes.",
    detail:
      "AHV supports three VLAN tagging modes on VM vNICs: (1) Access — the vNIC is on a single VLAN; traffic is untagged on the wire (OVS tags it on ingress to the uplink). This is the default and most common mode. (2) Trunk — the vNIC passes multiple VLANs; the VM is responsible for 802.1Q tagging (guest must support VLAN tagging). Used for vNICs in router/firewall VMs that need to receive multiple VLANs. (3) Native (a.k.a. trunk with native VLAN) — same as trunk, but one specified VLAN is untagged on egress; used when the upstream switch expects the native VLAN to be untagged. VLAN tags are configured in the AHV 'network' object (which is then attached to the VM vNIC) for Access mode, or directly on the vNIC for Trunk mode.",
    keyFacts: [
      "Access (default): single VLAN, untagged on the wire",
      "Trunk: multiple VLANs, VM does the 802.1Q tagging",
      "Native: trunk mode + one untagged VLAN (matches switchport trunk native)",
      "Configured via the AHV network object or directly on the vNIC",
    ],
    networkBridge:
      "This is exactly Cisco IOS `switchport mode access` vs `switchport mode trunk` vs `switchport trunk native vlan` — same 802.1Q semantics, just enforced by OVS instead of an ASIC.",
    gotcha:
      "If you trunk a vNIC, the upstream physical switchport must be a trunk port with the matching VLAN set. A common failure mode is trunking the VM but leaving the switchport in access mode — traffic will be silently dropped.",
    example:
      "A Palo Alto VM-50 in AHV with 4 vNICs: each vNIC is in trunk mode carrying VLANs 10, 20, 30, 40 respectively — the VM receives the tags and routes between them.",
    docRef: "AHV Networking — 'VLAN Tagging'",
  },
  {
    id: "ipam",
    term: "IP Address Management (IPAM)",
    module: "ahv-networking",
    difficulty: "Intermediate",
    short:
      "Prism's built-in DHCP server for managed AHV networks — assigns IPs to VM vNICs.",
    detail:
      "When you create an AHV network (a VLAN-tagged object on a bridge), you can optionally enable IPAM. IPAM is a lightweight DHCP server built into the CVM. It assigns IP addresses from a configured pool (subnet + IP range + gateway) to VMs that connect to that network. IPAM is convenient for lab/dev workloads and for VMs provisioned by Calm blueprints. For production workloads, most sites use their existing enterprise DHCP/Infoblox server instead — in that case, leave IPAM off and let the upstream DHCP server handle assignments. IPAM is per-network (per VLAN); each managed network has its own pool.",
    keyFacts: [
      "Built-in DHCP server running on the CVM",
      "Per-network (per VLAN) configuration: subnet, range, gateway",
      "Great for lab/dev + Calm-provisioned VMs",
      "For production, typically use enterprise DHCP/Infoblox instead",
    ],
    networkBridge:
      "IPAM ≈ running dhcpd inside the hypervisor for each port group. It's a real DHCP server — VMs broadcast, IPAM responds — so ensure no IP conflict with enterprise DHCP on the same VLAN.",
    gotcha:
      "If you enable IPAM on a VLAN that already has a DHCP server, you'll get rogue DHCP responses. Either keep IPAM off or carve a sub-range that the enterprise DHCP excludes.",
    docRef: "AHV Networking — 'IPAM'",
  },
  {
    id: "bond-modes",
    term: "Uplink Bond Modes",
    module: "ahv-networking",
    difficulty: "Intermediate",
    short:
      "How AHV aggregates physical NICs into a bond — active-backup (default), balance-slb, or LACP.",
    detail:
      "OVS bonds on AHV support three modes: (1) active-backup — one NIC is active, others are standby; no switch configuration required; default mode; failover takes ~1-3 seconds. (2) balance-slb — source-MAC-based load balancing across all uplinks; no switch configuration required; VM MACs are distributed across the bond members. (3) balance-tcp (LACP, 802.3ad) — true LACP aggregation; requires switch-side LACP configuration (Cisco 'channel-group X mode active'); requires LACP slow/fast timer; supports per-flow load balancing across uplinks. The recommended mode for production is LACP if the switch supports it (best bandwidth), otherwise active-backup (simplest, most reliable).",
    keyFacts: [
      "active-backup: default, no switch config, 1-3s failover",
      "balance-slb: per-VM-MAC load balancing, no switch config",
      "balance-tcp (LACP): 802.3ad, requires switch LACP, best bandwidth",
      "Prism validates switch LACP configuration during bond creation",
    ],
    networkBridge:
      "active-backup = Cisco 'mode on' (no protocol); balance-slb = Cisco 'src-mac' etherchannel without LACP; balance-tcp = Cisco 'channel-group mode active' with LACP.",
    gotcha:
      "Never mix LACP and non-LACP on the same bond. And never have one switch port in LACP and the other in static — the bond will flap. If you're dual-homed to two switches, use active-backup (LACP across two switches requires stacking/MC-LAG).",
    example:
      "Two 25 GbE NICs bonded with LACP to a stacked pair of Cisco 9300s gives 50 Gb/s aggregate, with per-flow distribution. Failover is sub-second because LACP fast timer detects peer loss.",
    docRef: "AHV Networking — 'Bond Modes'",
  },
  {
    id: "network-separation",
    term: "Traffic Separation (Mgmt / Storage / VM)",
    module: "ahv-networking",
    difficulty: "Intermediate",
    short:
      "Best practice for isolating Nutanix cluster management, storage, and user VM traffic on the physical network.",
    detail:
      "Nutanix clusters carry three logical traffic classes: (1) Management — CVM IP (192.168.5.x by default), hypervisor IP, Prism UI, SSH — typically a /24 or /27 VLAN. (2) Storage — CVM-to-CVM replication and iSCSI traffic; uses the 192.168.5.x range by default but should be on its own VLAN/subnet in production. (3) VM — user workload traffic, on whatever VLANs the VMs need. Two deployment patterns: 'flat' (all three on one bond, separated by VLAN) — common in small clusters; 'separated' (mgmt+VM on one bond, storage on a dedicated pair of NICs) — common in larger clusters where storage bandwidth must not compete with VM bandwidth. The storage network must be non-routable (RFC 1918, no gateway) for security — CVMs communicate on L2.",
    keyFacts: [
      "Three traffic classes: management, storage, VM",
      "Flat pattern: one bond, VLAN-separated (small clusters)",
      "Separated pattern: dedicated storage NICs (large clusters)",
      "Storage network: RFC 1918, no gateway, L2-only",
    ],
    networkBridge:
      "Treat the Nutanix storage network like an isolated SAN VLAN — no routing, no DHCP snooping dependencies, jumbo frames (MTU 9000) end-to-end. Same design rules you'd apply to an iSCSI network.",
    gotcha:
      "Enable jumbo frames (MTU 9000) on the storage network end-to-end — switch ports, bond, CVM, hypervisor. A 1500-byte MTU on any hop halves replication throughput due to TCP fragmentation.",
    example:
      "Standard 4-node cluster: bond0 = 2x 10 GbE (mgmt VLAN 100 + VM VLANs 200-300, jumbo off); bond1 = 2x 25 GbE (storage VLAN 5, MTU 9000, no gateway).",
    docRef: "Network Planning Guide",
  },
  {
    id: "jumbo-frames",
    term: "Jumbo Frames on Storage Network",
    module: "ahv-networking",
    difficulty: "Intermediate",
    short:
      "MTU 9000 end-to-end on the storage network — mandatory for production CVM-to-CVM throughput.",
    detail:
      "Jumbo frames (MTU 9000) on the Nutanix storage network is one of the highest-impact tuning knobs in the platform. CVMs replicate every write to peer CVMs over this network; with standard 1500-byte MTU, the TCP segment overhead and per-packet CPU cost caps throughput around 5-7 Gb/s on a 10 GbE link. With MTU 9000, the same link saturates at ~9.5 Gb/s. Jumbo frames must be enabled end-to-end: physical switch ports in the storage VLAN, the OVS bond on each AHV host, the CVM's internal storage interface, and the hypervisor's storage interface. A single 1500-byte hop silently degrades throughput — you'll see this in Prism → Analysis → 'CVM Network Throughput' as lower-than-expected bandwidth.",
    keyFacts: [
      "MTU 9000 on storage VLAN switch ports, bonds, CVM, hypervisor",
      "Boosts 10 GbE throughput from ~6 Gb/s to ~9.5 Gb/s",
      "Must be end-to-end; one 1500-byte hop halves throughput",
      "VM-facing network stays at 1500 (don't enable jumbo for VMs)",
    ],
    networkBridge:
      "Same rule as iSCSI/FCoE networks: jumbo end-to-end or not at all. Use `ping -M do -s 8972 <peer-cvm>` to verify the path can carry 9000-byte frames.",
    gotcha:
      "If jumbo is on the switch but not on the CVM's bond, replication will silently fall back to 1500-byte frames with no error. Always verify with `ping -M do -s 8972` between CVMs.",
    docRef: "Network Planning Guide — 'Jumbo Frames'",
  },

  // ───────────────────────────── PRISM ─────────────────────────────
  {
    id: "prism-element",
    term: "Prism Element (PE)",
    module: "prism",
    difficulty: "Foundational",
    short:
      "The single-cluster management plane — every Nutanix cluster has one Prism Element.",
    detail:
      "Prism Element is the per-cluster management interface. Every cluster, regardless of size, has exactly one PE. PE exposes the cluster's UI (https://<cluster-vip>:9440), REST API (v4 API current), and CLI (acli, ncli). Through PE you can: create/manage VMs, manage storage pools/containers, configure networking, view cluster health, run NCC, upgrade AOS, manage snapshots, and view performance analytics. PE is the unit of management for a single failure domain — if a cluster is down, its PE is down. PE IPs are typically VIP-backed (floating across CVMs) for HA; the VIP floats to a healthy CVM if the active one fails.",
    keyFacts: [
      "One PE per cluster; UI at https://<vip>:9440",
      "Manages single-cluster operations: VMs, storage, network, health, upgrade",
      "REST API v4 (current); CLI: acli, ncli",
      "VIP-backed for HA — floats across CVMs",
    ],
    networkBridge:
      "PE is to a Nutanix cluster what a switch's management IP is to a single switch. You log into one cluster at a time. To manage many clusters, you need Prism Central (the equivalent of a network management platform).",
    gotcha:
      "PE VIP must be on the management VLAN and reachable from your admin workstation. If the VIP is on the storage network, you won't be able to reach PE from outside the cluster.",
    docRef: "Prism Web Console Guide",
  },
  {
    id: "prism-central",
    term: "Prism Central (PC)",
    module: "prism",
    difficulty: "Foundational",
    short:
      "The multi-cluster management plane — manages many Prism Elements as one logical platform.",
    detail:
      "Prism Central is the multi-cluster, multi-site management plane. PC runs as a VM (or a 3-VM scale-out VM) and aggregates multiple PEs under a single pane of glass. Through PC you get: cross-cluster VM search and lifecycle, multi-cluster App-Security policies (Flow), Calm blueprint orchestration, Karbon Kubernetes cluster provisioning, centralized RBAC with SAML/AD, projects (multi-tenancy), categories for tag-based policy, and a unified REST API (v3 / v4). PC is required for: Flow Network Security (micro-segmentation), Calm, Karbon, Files multi-cluster management, and Objects. PC does NOT replace PE — PE continues to own single-cluster operations; PC orchestrates across PEs.",
    keyFacts: [
      "Runs as a VM (or 3-VM scale-out) typically on a dedicated cluster",
      "Aggregates multiple PEs; required for Flow, Calm, Karbon, Files, Objects",
      "Provides projects (multi-tenancy) + categories (tag-based policy)",
      "REST API v4 current; SAML + AD for auth",
    ],
    networkBridge:
      "PC ≈ VMware vCenter but for many clusters, plus a service mesh for advanced services (Flow, Calm, Karbon). If PE = switch management IP, PC = the network management system that talks to all your switches.",
    gotcha:
      "PC is itself a workload — size the PC VM correctly (16+ vCPU, 32+ GB RAM minimum for small; 3-VM scale-out for production). An undersized PC is the #1 cause of slow PC UI and failed PC upgrades.",
    docRef: "Prism Central Administration Guide",
  },
  {
    id: "categories",
    term: "Categories (Tag-based Policy)",
    module: "prism",
    difficulty: "Intermediate",
    short:
      "Key/value tags attached to VMs, hosts, clusters — used by Flow, Calm, RBAC, and reporting.",
    detail:
      "Categories are Nutanix's universal tag system. Every object (VM, host, cluster, image, network) can have one or more category values assigned, where each category has a name and value (e.g. App=Payroll, Tier=Gold, Env=Prod). Categories drive policy across the platform: Flow Network Security policies match on category pairs (e.g. 'App=Web can talk to App=App'); Calm blueprints can pin VMs to hosts with specific categories; RBAC projects can restrict by category; reporting and cost analysis group by category. Categories are required for Flow micro-segmentation — without categories, you cannot write a Flow policy. PC manages categories globally; PEs inherit them when registered.",
    keyFacts: [
      "Key/value tag system: category name + value (e.g. App=Payroll)",
      "Drives Flow, Calm, RBAC, reporting, cost analysis",
      "Required for Flow Network Security policies",
      "Defined on PC; inherited by PEs on registration",
    ],
    networkBridge:
      "Categories ≈ AWS tags or Azure labels — same idea (tag-driven policy), but with first-class policy enforcement via Flow rather than via separate IAM.",
    gotcha:
      "Design your category taxonomy up front. Renaming or restructuring categories after policies are built breaks the policies. Common taxonomy: App, Tier, Env, Owner, CostCenter.",
    docRef: "Prism Central — 'Categories'",
  },
  {
    id: "rbac",
    term: "Role-Based Access Control (RBAC)",
    module: "prism",
    difficulty: "Intermediate",
    short:
      "Permission model: assign roles (Cluster Admin, Operator, Viewer, etc.) to users/groups, scoped to projects.",
    detail:
      "Prism RBAC maps users/groups (from AD, SAML, or local) to roles at three scopes: (1) PC-wide — applies to everything PC sees; (2) Project — applies to a multi-tenant project (objects scoped to the project); (3) Category — applies to objects matching a category (rare). Built-in roles include: Cluster Admin (full cluster control), Operator (VM power ops + console), Viewer (read-only), Image Admin, Network Admin, Calm Developer, Self-Service User. Custom roles can be created with fine-grained permission lists. AD integration: PC reads group membership from AD/LDAP; SAML: PC consumes SAML assertions from IdP (Okta, ADFS, Azure AD). Always prefer group-based role assignment over user-based for manageability.",
    keyFacts: [
      "Scopes: PC-wide, Project, Category",
      "Built-in roles: Cluster Admin, Operator, Viewer, Image Admin, …",
      "AD, LDAP, SAML, or local users",
      "Always prefer group-based over user-based role assignment",
    ],
    networkBridge:
      "RBAC ≈ TACACS+/RADIUS roles on network gear — same principle (assign permissions to groups, not users). The difference: Nutanix RBAC is object-scoped (projects), not just command-scoped.",
    gotcha:
      "AD group membership changes can take up to 30 min to reflect in PC (token refresh window). If you remove a user from an AD group, they may retain access for ~30 min.",
    docRef: "Security Guide — 'RBAC'",
  },
  {
    id: "image-management",
    term: "Image Management",
    module: "prism",
    difficulty: "Foundational",
    short:
      "Centralized ISO/CLOUD-init image store on PC — single source of truth for VM templates and ISOs.",
    detail:
      "Prism Central's Image Service stores ISOs and disk images (qcow2, raw, vmdk) in a single place. Images are replicated to each registered PE on demand (or pre-seeded). When you create a VM from an image, the PE clones the image into the VM's vDisk — no need to upload the same ISO to every cluster. Image Service supports: multi-cluster replication, image versioning, image-level categories (for policy), and a 'spec' that drives Calm blueprint cloning. Common images: CentOS/RHEL/Ubuntu cloud-init ISOs, Windows Sysprep VHDs, virtual appliance ISOs (Nutanix Move, Flow Network VM, etc.).",
    keyFacts: [
      "Centralized image store on PC; replicated to PEs on demand",
      "Supports ISO, qcow2, raw, vmdk",
      "Image-level categories for policy + Calm cloning",
      "Single source of truth — no per-cluster ISO uploads",
    ],
    networkBridge:
      "Image Service ≈ a network boot server (PXE/TFTP) but for VM templates — instead of PXE-booting, you pick an image and the platform clones it.",
    gotcha:
      "Image upload to PC is via multipart upload — large images (>50 GB) over WAN can time out. Upload images from a workstation co-located with PC, or use the 'URL' import option for HTTP-accessible images.",
    docRef: "Image Service Guide",
  },
  {
    id: "alerts-analysis",
    term: "Alerts & Analysis",
    module: "prism",
    difficulty: "Foundational",
    short:
      "PE/PC's built-in monitoring: real-time alerts, time-series metrics, predictive capacity planning.",
    detail:
      "Every Nutanix cluster ships with a built-in time-series DB and alerting engine. Alerts are pre-configured for ~250 conditions (disk failure, CVM down, OpLog saturation, RF violation, etc.) and route via email, SNMP trap, webhook, or PagerDuty. The Analysis tab lets you chart any metric (CPU, RAM, IOps, latency, network throughput, capacity) against any entity (cluster, host, CVM, VM, disk, container) over any time range. PC's 'Analysis' adds cross-cluster aggregation and 'Playbooks' (saved dashboard views). Capacity planning: PC's 'Capacity' tab forecasts runway based on growth rate and projects the cluster's time-to-full.",
    keyFacts: [
      "Pre-configured alerts for ~250 conditions; email/SNMP/webhook/PagerDuty",
      "Time-series metrics on every entity",
      "PC adds cross-cluster aggregation + Playbooks (saved dashboards)",
      "Capacity planning: runway forecast based on growth rate",
    ],
    networkBridge:
      "Alerts & Analysis ≈ a built-in PRTG/Datadog — no need for separate monitoring. For enterprise integration, forward alerts via webhook to Splunk/ELK.",
    gotcha:
      "Default alert thresholds are conservative — tune them in your first month or you'll get noise. Common tuning: raise 'CVM CPU' alert from 80% to 90%, raise 'HDD latency' from 20 ms to 50 ms for archive tiers.",
    docRef: "Prism — 'Alerts and Analysis'",
  },

  // ───────────────────────────── FLOW ─────────────────────────────
  {
    id: "flow-overview",
    term: "Flow (Network Virtualization)",
    module: "flow",
    difficulty: "Foundational",
    short:
      "Nutanix's SDN stack: Flow Virtual Networking (VPCs) + Flow Network Security (micro-seg) + Flow Virtual DNS.",
    detail:
      "Flow is the umbrella brand for Nutanix's software-defined networking. It has three sub-products: (1) Flow Virtual Networking (FVN) — software-defined VPCs with subnets, floating IPs, NAT, routing — overlays L2/L3 across AHV clusters without touching the underlay. (2) Flow Network Security (FNS) — micro-segmentation policies that filter east-west traffic between VMs based on categories (e.g. 'App=Web cannot talk to App=Db'). (3) Flow Virtual DNS — a DNS service that resolves names inside VPCs. Flow is enabled from PC; it requires PC and AHV (Flow is not supported on ESXi/Hyper-V for FVN). FNS is supported on all hypervisors.",
    keyFacts: [
      "Three sub-products: Virtual Networking (VPCs), Network Security (micro-seg), Virtual DNS",
      "FVN = overlay network; underlay only carries the encapsulated traffic",
      "FNS = east-west firewall using category-pair policies",
      "FVN requires AHV; FNS supports all hypervisors",
    ],
    networkBridge:
      "Flow Virtual Networking ≈ NSX-T segments / Cisco ACI EPGs; Flow Network Security ≈ NSX Distributed Firewall / Cisco ACI contracts. Same overlay + micro-seg model, integrated with Nutanix categories.",
    gotcha:
      "FVN and FNS are licensed separately. Verify which Flow license you have before designing — FNS-only clusters can't do VPCs.",
    docRef: "Flow Administration Guide",
  },
  {
    id: "vpc",
    term: "Flow Virtual Private Cloud (VPC)",
    module: "flow",
    difficulty: "Intermediate",
    short:
      "An overlay network that spans AHV clusters and provides isolated L2/L3 with its own IP space.",
    detail:
      "A Flow VPC is a software-defined network that overlays the physical network. Inside a VPC, you define subnets (e.g. 10.0.1.0/24, 10.0.2.0/24) and the platform routes between them. A VPC can span multiple AHV clusters, so VMs in cluster A and cluster B can be in the same L2 subnet without stretching a VLAN — the underlay just carries the encapsulated (GENEVE) traffic. Each VPC has a virtual router that handles: inter-subnet routing, NAT (SNAT for egress to external, DNAT for ingress via floating IP), and optionally an external subnet (a transit network to your physical routers). VPCs use overlapping IP spaces (RFC 1918) by design — multiple VPCs can each use 10.0.0.0/16.",
    keyFacts: [
      "Overlay network spanning multiple AHV clusters",
      "Subnets inside VPC; virtual router routes between subnets",
      "NAT: SNAT for egress, floating IP for ingress",
      "Overlapping IP spaces OK across VPCs (RFC 1918 reuse)",
    ],
    networkBridge:
      "VPC ≈ AWS VPC / Azure VNet — same idea (overlay, isolated IP space, subnets, route table, NAT gateway). The 'external subnet' is your VPC's Internet Gateway equivalent.",
    gotcha:
      "Floating IPs are DNAT'd to the VM's private IP — they don't reconfigure the VM's vNIC. The VM still has its private IP; FVN does the NAT in the data path.",
    example:
      "3-tier app in a VPC: web subnet 10.0.1.0/24, app subnet 10.0.2.0/24, db subnet 10.0.3.0/24. FVN routes between them; web tier has floating IPs for external access.",
    docRef: "Flow Virtual Networking Guide",
  },
  {
    id: "micro-seg",
    term: "Flow Network Security (Micro-Segmentation)",
    module: "flow",
    difficulty: "Intermediate",
    short:
      "East-west firewall between VMs based on category pairs (App=A → App=B), enforced in the hypervisor.",
    detail:
      "Flow Network Security (FNS) is the micro-segmentation layer of Flow. Policies are written as: source category, destination category, allowed protocols/ports, action (allow/deny/reject). For example: 'App=Web can talk to App=App on TCP 443' and 'App=App can talk to App=Db on TCP 5432'. The policy is enforced inside the hypervisor (in the OVS data path) on every packet — no appliance required. Default policy is 'allow all' (segmented by cluster, isolated by VLAN) until you explicitly apply an 'isolation' policy. FNS supports: hit counts (per-rule traffic stats), policy hits (logged to PC), and 'quarantine' mode (one-click isolate a compromised VM). FNS uses the AHV distributed firewall; on ESXi, it uses the ESXi distributed firewall equivalent (requires NSX-T or vDS).",
    keyFacts: [
      "Policy = source category + dest category + ports + action",
      "Enforced in hypervisor (OVS data path on AHV); no appliance",
      "Default = allow all until isolation policy applied",
      "Per-rule hit counts; one-click quarantine mode",
    ],
    networkBridge:
      "FNS ≈ NSX Distributed Firewall / Cisco ACI contract / Palo Alto micro-seg — same east-west filtering, same tag-based policy model. The difference: enforcement is in the hypervisor, not in an appliance.",
    gotcha:
      "Start with 'monitor' mode (log all hits, no enforcement) for 1-2 weeks before switching to 'enforce' mode. This catches missing policies before they break production.",
    example:
      "Quarantine a compromised VM: one click in Prism → FNS sets a 'deny all' policy on that VM's categories. The VM stays up but cannot talk to anything — useful for incident response.",
    docRef: "Flow Network Security Guide",
  },
  {
    id: "floating-ip",
    term: "Floating IP (DNAT)",
    module: "flow",
    difficulty: "Intermediate",
    short:
      "A publicly-routable IP that DNATs to a VM's private IP — survives VM live-migration across hosts.",
    detail:
      "A floating IP in Flow is an external IP that the platform DNATs to a VM's private VPC IP. The floating IP lives in the VPC's external subnet (which is a real, routed VLAN on your physical network). When traffic arrives at the floating IP, FVN rewrites the destination to the VM's private IP and forwards it. The key benefit vs traditional DNAT: the floating IP is bound to the VM, not to the host. If the VM live-migrates to another host, the floating IP follows it — no ARP gymnastics, no switch reconfiguration. Floating IPs are typically used for: external-facing services (web servers, load balancers), and for keeping a stable IP when a VM fails over (paired with the VM's elasticity).",
    keyFacts: [
      "External IP DNAT'd to VM's private VPC IP",
      "Bound to the VM, not the host — survives live migration",
      "Lives in the VPC's external subnet (a real VLAN)",
      "Used for external services + failover-stable IPs",
    ],
    networkBridge:
      "Floating IP ≈ AWS Elastic IP / Azure Public IP — same idea (stable external IP, NAT'd to a private IP, follows the workload). The implementation is hypervisor-side DNAT, not router-side.",
    gotcha:
      "Floating IPs are a finite resource (limited by your external subnet size). Don't assign one to every VM — reserve for external-facing services only.",
    docRef: "Flow Virtual Networking — 'Floating IPs'",
  },
  {
    id: "nat-snat",
    term: "NAT & SNAT in Flow VPCs",
    module: "flow",
    difficulty: "Intermediate",
    short:
      "Source NAT for VPC egress to external networks; the VPC virtual router rewrites source IPs.",
    detail:
      "Every VPC has SNAT enabled by default on its external subnet. When a VM in a VPC initiates a connection to an external destination (e.g. an Internet IP), the VPC's virtual router rewrites the source IP from the VM's private IP (e.g. 10.0.1.5) to the router's external IP (a real IP on the underlay VLAN). Return traffic is reverse-NAT'd. This means VMs in a VPC can reach external networks without each needing a routable IP — they all egress through one SNAT IP. For inbound, you use a floating IP (which is a per-VM DNAT). SNAT and floating IPs can coexist: outbound uses SNAT (router IP), inbound uses floating IP (per-VM).",
    keyFacts: [
      "SNAT enabled by default on VPC external subnet",
      "All VMs in VPC egress via one router IP",
      "Floating IP = per-VM DNAT for inbound",
      "SNAT and floating IP can coexist on the same VM",
    ],
    networkBridge:
      "SNAT ≈ Cisco PAT (overload) on a router interface — many inside IPs, one outside IP. Floating IP ≈ Cisco static NAT — one outside IP, one inside IP.",
    gotcha:
      "If you disable SNAT on a VPC, VMs in that VPC have no egress unless they have a floating IP. Most production VPCs keep SNAT on for outbound + floating IPs for inbound.",
    docRef: "Flow Virtual Networking — 'NAT'",
  },
  {
    id: "geneve",
    term: "GENEVE Encapsulation",
    module: "flow",
    difficulty: "Advanced",
    short:
      "The encapsulation protocol Flow uses to overlay VPC traffic across the underlay (defined in RFC 8926).",
    detail:
      "GENEVE (Generic Network Virtualization Encapsulation, RFC 8926) is the encapsulation protocol used by Flow Virtual Networking to carry VPC traffic across the physical (underlay) network. When VM-A in VPC1 sends a frame to VM-B in the same VPC, the FVN virtual switch on VM-A's host wraps the original L2/L3 frame in a GENEVE header (which includes a VNI — Virtual Network Identifier, 24 bits) and sends it over UDP/6081 to VM-B's host. The receiving host unwraps GENEVE, reads the VNI, and delivers the original frame to VM-B. GENEVE replaced VXLAN because it's more flexible (variable-length TLV options). Underlay requirements: IP reachability between AHV hosts, UDP 6081 allowed, jumbo frames strongly recommended (GENEVE adds ~50 bytes overhead; 1500-byte underlay = 1450-byte VM MTU).",
    keyFacts: [
      "GENEVE = RFC 8926; UDP/6081; 24-bit VNI",
      "Replaces VXLAN; supports variable-length options TLV",
      "Adds ~50 bytes overhead — underlay MTU 9000 recommended",
      "Underlay requirements: IP reachability + UDP 6081 allowed",
    ],
    networkBridge:
      "GENEVE ≈ VXLAN with extra metadata. If you've designed a VXLAN BGP EVPN fabric, the same design principles apply: spine-leaf underlay, jumbo MTU, EVPN control plane (optional in FVN).",
    gotcha:
      "If the underlay is 1500-byte MTU, FVN auto-clamps the VM MTU to 1450. VMs that hardcode MTU 1500 in their config will silently drop large packets. Either enable jumbo on the underlay or set VM MTU to 1450.",
    docRef: "Flow Virtual Networking — 'Underlay Requirements'",
  },

  // ───────────────────────────── DATA SERVICES ─────────────────────────────
  {
    id: "files",
    term: "Nutanix Files",
    module: "data-services",
    difficulty: "Intermediate",
    short:
      "Native SMB + NFS file server running as VMs on the cluster — replaces Windows FS / NetApp filer.",
    detail:
      "Nutanix Files (formerly AFS) is the platform's native file service. It runs as one or more 'Files VMs' on the cluster; each Files VM is a Linux-based SMB/NFS server that exposes DSF-backed storage as file shares. Files supports: SMB 2/3 (with continuous availability), NFS v3/v4.1, Kerberos, AD integration, snapshots, replication (Async DR), file-level restores, dedup, compression, antivirus integration (ICAP), and quota management. A typical deployment: one Files VM per cluster per protocol (SMB and NFS can co-exist), with shares carved out and presented to users. Files replaces both Windows File Server clusters and traditional NAS filers (NetApp, EMC Isilon) for general-purpose workloads. Files requires Prism Central for management.",
    keyFacts: [
      "SMB 2/3 + NFS v3/v4.1; continuous availability for SMB",
      "Runs as Files VMs on the cluster; managed via PC",
      "Snapshots, async DR, file-level restore, ICAP AV, quotas",
      "Replaces Windows FS cluster + traditional NAS filers",
    ],
    networkBridge:
      "Files ≈ a NetApp FAS / EMC Isilon running as VMs on the cluster — same protocols (SMB/NFS), same AD integration, but no separate appliance to manage.",
    gotcha:
      "Files VM sizing matters — too small and SMB clients will see slow responses. Use the Files Sizing Guide; rule of thumb: 1 vCPU + 4 GB RAM per 1 TB of file data.",
    docRef: "Nutanix Files Administration Guide",
  },
  {
    id: "volumes",
    term: "Nutanix Volumes (ABS)",
    module: "data-services",
    difficulty: "Intermediate",
    short:
      "Block storage (iSCSI) exposed directly to external hosts — replaces traditional SAN LUNs.",
    detail:
      "Nutanix Volumes (formerly ABS — Acropolis Block Service) exposes DSF-backed storage as iSCSI LUNs to external hosts (physical servers, bare-metal DBs, hyper-V clusters that need shared storage). Each volume is presented as an iSCSI target; the external host connects via standard iSCSI (MPIO recommended). Volumes supports: per-volume QoS (limit IOps), multi-attach (for shared-disk clusters like WSFC), snapshots, async DR, replication, and inline dedup/compression. Typical use cases: physical SQL Server needing shared block storage, Hyper-V cluster shared volumes, bare-metal Oracle RAC. Volumes does NOT require Prism Central — managed via PE — but can be aggregated in PC.",
    keyFacts: [
      "iSCSI target service; standard iSCSI + MPIO from host",
      "Per-volume QoS, multi-attach, snapshots, async DR",
      "Use cases: physical SQL, Oracle RAC, Hyper-V CSV",
      "Managed via PE; PC aggregation optional",
    ],
    networkBridge:
      "Volumes ≈ a NetApp LUN or EMC LUN served via iSCSI — same wire protocol, same MPIO best practices. The LUN just happens to live on a distributed storage fabric instead of a dual-controller array.",
    gotcha:
      "Always use MPIO with at least two paths (to two different CVM IPs) for high availability. A single iSCSI session means CVM failure = host IO failure.",
    example:
      "Physical SQL Server with 4 NICs: two iSCSI NICs (one to CVM-A, one to CVM-B) using MPIO round-robin. QoS limit on the volume: 50,000 IOps to prevent noisy-neighbor impact on VM workloads.",
    docRef: "Nutanix Volumes Administration Guide",
  },
  {
    id: "objects",
    term: "Nutanix Objects",
    module: "data-services",
    difficulty: "Intermediate",
    short:
      "S3-compatible object storage running on the cluster — replaces AWS S3 / MinIO on-prem.",
    detail:
      "Nutanix Objects is the platform's S3-compatible object store. It runs as a set of 'Objects VMs' on the cluster and exposes an S3 API (REST) endpoint. Objects supports: S3 API compatibility (most S3 clients work unmodified), buckets, lifecycle policies, versioning, encryption at rest (KMS-managed keys), WORM (write-once-read-many) for compliance, replication across clusters, and tiering to AWS S3 / Azure Blob. Use cases: backup target (Veeam, Commvault), log archive, ML data lake, application media storage. Objects requires Prism Central for management. S3 clients use AWS SDK, boto3, aws-cli, s3cmd, etc. — just point them at the Objects endpoint URL with appropriate access/secret keys.",
    keyFacts: [
      "S3 API compatible; works with aws-cli, boto3, s3cmd",
      "Buckets, versioning, lifecycle, WORM, encryption at rest",
      "Replication across clusters; tiering to AWS S3 / Azure Blob",
      "Managed via PC; runs as Objects VMs on the cluster",
    ],
    networkBridge:
      "Objects ≈ on-prem AWS S3 / MinIO. Same S3 API, same bucket model, same access key / secret key auth. The difference: it lives on your Nutanix cluster with no separate appliance.",
    gotcha:
      "Objects endpoints use HTTPS with a self-signed cert by default. Either install a CA-signed cert on the Objects endpoint, or distribute the self-signed CA to clients — otherwise S3 clients will refuse to connect.",
    example:
      "Veeam backup target: create an Objects bucket 'veeam-backups', point Veeam at the Objects S3 URL with access/secret keys, set lifecycle policy to move objects >30 days to AWS S3 Glacier.",
    docRef: "Nutanix Objects Administration Guide",
  },
  {
    id: "era",
    term: "Nutanix Era (Database-as-a-Service)",
    module: "data-services",
    difficulty: "Advanced",
    short:
      "DBaaS platform — provisions, patches, snapshots, and clones Microsoft SQL, Oracle, PostgreSQL, and SAP HANA databases.",
    detail:
      "Nutanix Era is the platform's database-as-a-service layer. Era automates the day-2 lifecycle of databases: provisioning (one-click new DB with a profile), patching (rolling patches across DBs), backup (snapshot-based, with log shipping for SQL/Oracle), refresh (clone prod to dev/test in minutes), and time-travel (restore to any point in time). Era supports Microsoft SQL Server, Oracle (11g+), PostgreSQL, and SAP HANA. Era uses DSF snapshots under the hood — a database clone is a writeable snapshot that consumes no extra space until changes are written. Era requires Prism Central and a dedicated 'Era Server' VM. Use cases: dev/test provisioning (clone prod to dev nightly), database refresh automation, patch orchestration across many DB instances.",
    keyFacts: [
      "DBaaS for SQL Server, Oracle, PostgreSQL, SAP HANA",
      "Provisioning, patching, snapshots, refresh, time-travel restore",
      "Database clones = writeable DSF snapshots (zero-space initial)",
      "Requires PC + Era Server VM",
    ],
    networkBridge:
      "Era ≈ AWS RDS / Azure SQL Managed Instance — same DBaaS model (provision, patch, backup, clone). The difference: it runs on your hardware, with your existing DB licenses.",
    gotcha:
      "Era clones are not magic — every write to the clone consumes new space. A dev clone that's actively modified can balloon storage; set quotas on dev containers.",
    example:
      "Refresh dev DB nightly: Era time-machine provisions a writeable snapshot of last night's prod DB → dev team has a fresh prod-like DB every morning, no manual restore needed.",
    docRef: "Nutanix Era Administration Guide",
  },

  // ───────────────────────────── OPERATIONS ─────────────────────────────
  {
    id: "calm",
    term: "Nutanix Calm (Application Orchestration)",
    module: "operations",
    difficulty: "Intermediate",
    short:
      "Blueprint-based application orchestration: define multi-VM apps as code, deploy across on-prem + cloud.",
    detail:
      "Calm is Nutanix's application orchestration platform. A Calm blueprint is a YAML/JSON document that defines a multi-VM application: VM specs (CPU/RAM/disk), network attachments, install scripts (Bash/PowerShell/Ansible), Day-2 actions (scale-out, scale-in, custom runbooks), and policies (who can deploy, quota). Blueprints can deploy to: AHV on-prem, AWS, Azure, VMware (via Calm for VMware), and Google Cloud. Calm integrates with PC categories for policy, and with Era for DB provisioning. Common use cases: 3-tier app provisioning (web + app + db in one blueprint), Nginx HA cluster deployment, repeatable dev environment provisioning, scaling stateless web tiers up/down on schedule.",
    keyFacts: [
      "Blueprints = multi-VM app-as-code (YAML)",
      "Day-2 actions: scale-out/in, runbooks, custom scripts",
      "Deploys to AHV, AWS, Azure, VMware, GCP",
      "Integrates with PC categories + Era for DB",
    ],
    networkBridge:
      "Calm ≈ AWS CloudFormation / Azure ARM templates / Terraform — same IaC model. The unique bit: Calm includes Day-2 runbook actions, not just provisioning.",
    gotcha:
      "Blueprints are version-controlled — always version every change. A bad blueprint can be rolled back; a bad in-place edit cannot.",
    example:
      "3-tier web app blueprint: 2x nginx (web) + 2x tomcat (app) + 1x postgres (db), with a 'scale-out web' action that adds an nginx instance and registers it with the load balancer.",
    docRef: "Nutanix Calm Administration Guide",
  },
  {
    id: "move",
    term: "Nutanix Move (Migration)",
    module: "operations",
    difficulty: "Intermediate",
    short:
      "VM migration tool — moves VMs from VMware ESXi, Hyper-V, AWS, Azure, physical servers into Nutanix AHV.",
    detail:
      "Nutanix Move (formerly Xtract) is the platform's migration tool. Move runs as a VM (the Move VM) and orchestrates migrations from source hypervisors (VMware ESXi, Hyper-V, AWS EC2, Azure VM, AWS/Azure to AHV/ESXi on Nutanix) to target Nutanix clusters. Move supports: bulk migration (many VMs in parallel), delta sync (initial copy then incremental sync until cutover), change VM format (VMDK → QCOW2), network remapping (VDS port group → AHV network), and post-migration script execution (e.g. install Nutanix Guest Tools). Move handles the source-side quiescing (VMware snapshot for VDDK-based read) and the target-side import. Use cases: VMware-to-AHV migration, AWS repatriation, Hyper-V consolidation.",
    keyFacts: [
      "Sources: ESXi, Hyper-V, AWS, Azure, physical (via VMware vCenter Converter)",
      "Targets: AHV, ESXi on Nutanix",
      "Bulk + delta-sync migration; format conversion (VMDK→QCOW2)",
      "Network remapping: source port group → target AHV network",
    ],
    networkBridge:
      "Move ≈ VMware HCX / Zerto cross-platform — same source-target migration model with delta sync. The unique bit: format conversion (VMDK→QCOW2) happens inline.",
    gotcha:
      "Always do a test migration on a non-critical VM first. Network remapping is the #1 issue — if your AHV network mapping is wrong, the migrated VM comes up with no network.",
    example:
      "Migration of 200 VMs from ESXi to AHV: Move bulk-migrates 200 VMs over a weekend, delta-syncs each VM, then on cutover day shuts down source VM, final delta-sync, powers on target VM.",
    docRef: "Nutanix Move Administration Guide",
  },
  {
    id: "karbon",
    term: "Nutanix Karbon (Kubernetes)",
    module: "operations",
    difficulty: "Advanced",
    short:
      "Managed Kubernetes on Nutanix — provisions and operates K8s clusters on AHV with one click.",
    detail:
      "Nutanix Karbon (now part of 'Nutanix Kubernetes Engine' / NKE) is the platform's managed Kubernetes service. From Prism Central, you click 'Provision Kubernetes Cluster', specify node counts (master + workers), and NKE provisions the VMs, the K8s control plane, the CNI (Cilium by default), the CSI (Nutanix CSI for persistent volumes), and the registry integration. NKE handles: cluster lifecycle (upgrade K8s version), node auto-repair, snapshot/DR, and access (kubeconfig download). NKE uses kubeadm under the hood; clusters are CNCF-conformant. Use cases: on-prem container platform (replacing OpenShift/Rancher), CI/CD ephemeral clusters, ML workloads with GPU nodes. NKE is licensed separately; clusters consume AHV resources like any other VM workload.",
    keyFacts: [
      "Managed K8s on AHV; one-click provisioning from PC",
      "Cilium CNI; Nutanix CSI for persistent volumes",
      "Lifecycle: K8s version upgrades, node auto-repair, DR",
      "kubeadm-based; CNCF-conformant",
    ],
    networkBridge:
      "NKE ≈ AWS EKS / Azure AKS / GKE on-prem — same managed K8s model. The networking inside the cluster (Cilium) is the same tech you'd see on EKS with Cilium add-on.",
    gotcha:
      "K8s node VMs are real VMs — they consume cluster resources. Size the worker nodes for the workloads, not the node count. A few large workers > many small workers for production.",
    example:
      "Production K8s cluster: 3 master nodes + 5 worker nodes (16 vCPU, 64 GB each), Cilium CNI, Nutanix CSI providing persistent volumes for stateful workloads (PostgreSQL, Prometheus).",
    docRef: "Nutanix Kubernetes Engine Guide",
  },
  {
    id: "xi-leap",
    term: "Xi Leap (Disaster Recovery as a Service)",
    module: "operations",
    difficulty: "Intermediate",
    short:
      "DRaaS — replicate on-prem VMs to Nutanix-hosted cloud; failover in minutes.",
    detail:
      "Xi Leap (now branded 'Nutanix Cloud Disaster Recovery' / NCDR) is the platform's DR-as-a-Service offering. NCDR replicates on-prem Nutanix VMs to a target Nutanix cluster hosted in the Nutanix cloud (or AWS). Replication is asynchronous, near-continuous (RPO ~15 minutes typical), and includes both the VM data and metadata. On DR invocation, NCDR spins up the VMs in the cloud target — typically 5-15 minute RTO. NCDR supports: runbooks (multi-VM startup ordering, IP remapping), test failover (non-disruptive), planned migration (for maintenance), and failback (reverse replication to bring changes back to primary). NCDR is consumed as a service — no Nutanix hardware at the DR site required.",
    keyFacts: [
      "DRaaS to Nutanix-hosted cloud (or AWS target)",
      "Async replication; ~15 min RPO, 5-15 min RTO",
      "Runbooks: startup order, IP remapping",
      "Test failover (non-disruptive) + planned migration + failback",
    ],
    networkBridge:
      "NCDR ≈ VMware Site Recovery Manager (SRM) / Zerto cloud DR — same runbook + RTO/RPO model. The unique bit: target is a managed Nutanix cluster, not shared cloud infra.",
    gotcha:
      "Network re-IP at failover: NCDR can rewrite VM IPs to the DR site's subnet, but DNS records must be updated separately. Use a short TTL on DNS records for DR-prone VMs.",
    example:
      "DR for 50-VM web app: NCDR replicates VMs to Nutanix cloud, runbook starts web tier first, then app tier, then DB; rewrites IPs from 10.0.x.x (prod) to 172.16.x.x (DR).",
    docRef: "Nutanix Cloud DR Guide",
  },
  {
    id: "ncr",
    term: "Nutanix Guest Tools (NGT)",
    module: "operations",
    difficulty: "Foundational",
    short:
      "In-guest agent for VSS snapshots, static IP customization, file-level restore, and self-service reboot.",
    detail:
      "Nutanix Guest Tools (NGT) is a small agent installed inside guest VMs (Windows or Linux). NGT enables: (1) VSS-aware snapshots on Windows (application-consistent snapshots for SQL, Exchange, etc.), (2) Static IP customization during cloning (set guest IP from Prism without guest-side scripts), (3) File-level restore (mount a snapshot inside the guest and browse individual files), (4) Self-service VM reboot from Prism (uses NGT to gracefully reboot). NGT is optional but recommended for production Windows VMs that need app-consistent backups. NGT communicates with the CVM over the management network (port 2070-2080).",
    keyFacts: [
      "In-guest agent (Windows + Linux)",
      "VSS snapshots (app-consistent on Windows)",
      "Static IP customization during cloning",
      "File-level restore + self-service reboot",
      "Communicates with CVM over mgmt network (ports 2070-2080)",
    ],
    networkBridge:
      "NGT ≈ VMware Tools — same idea (in-guest agent that enables platform features). The unique bit: NGT includes static IP customization for cloning, which VMware Tools doesn't natively.",
    gotcha:
      "NGT upgrade is bundled with AOS — but the in-guest agent isn't auto-upgraded. After AOS upgrade, push the new NGT from Prism to all VMs to keep versions in sync.",
    docRef: "Nutanix Guest Tools Guide",
  },

  // ───────────────────────────── HYBRID CLOUD ─────────────────────────────
  {
    id: "nc2",
    term: "Nutanix Cloud Clusters (NC2)",
    module: "hybrid-cloud",
    difficulty: "Intermediate",
    short:
      "Run Nutanix software on AWS / Azure bare-metal — same AOS, same Prism, hosted in public cloud.",
    detail:
      "NC2 deploys Nutanix software on bare-metal instances inside AWS and Azure. The cloud provider supplies the hardware (AWS: Metal instances; Azure: dedicated hosts); Nutanix supplies AOS, AHV, and management. From the user's perspective, an NC2 cluster is just another Nutanix cluster — same Prism UI, same acli, same Flow, same Calm. NC2 enables: burst-to-cloud (run steady-state on-prem, burst to cloud for peak), cloud migration (move workloads to cloud without re-platforming), and cloud-native Nutanix services (run Files/Objects/Era in cloud). NC2 clusters can be managed by the same PC as on-prem clusters — one operational plane across hybrid. Networking: NC2 clusters connect to your AWS/Azure VNet via a dedicated ENI; underlay is provided by AWS/Azure SDN.",
    keyFacts: [
      "Nutanix on AWS bare-metal / Azure dedicated hosts",
      "Same AOS, AHV, Prism, Flow, Calm as on-prem",
      "Single Prism Central across on-prem + cloud",
      "Connects to your AWS/Azure VNet via dedicated ENI",
    ],
    networkBridge:
      "NC2 ≈ running your own EUC/SDDC on AWS bare-metal — but with Nutanix HCI semantics instead of vSphere. Network integration is via VNet peering + transit gateway.",
    gotcha:
      "NC2 nodes are billed hourly by the cloud provider — long-running NC2 clusters cost more than on-prem. Right-size NC2 for burst/migration use cases; keep steady-state on-prem.",
    example:
      "Seasonal retail: on-prem 8-node cluster handles steady load; NC2 4-node cluster on AWS spins up for Black Friday, decommissions in January. Same Prism Central manages both.",
    docRef: "NC2 on AWS / NC2 on Azure Guide",
  },
  {
    id: "nc2-networking",
    term: "NC2 Networking Model",
    module: "hybrid-cloud",
    difficulty: "Advanced",
    short:
      "How NC2 clusters integrate with AWS/Azure VNet — underlay, peering, and Flow overlay.",
    detail:
      "NC2 networking has two layers: (1) Underlay — AWS/Azure native SDN. NC2 clusters are deployed into a VPC/VNet; each NC2 node gets a primary ENI on a cloud-native subnet. CVM-to-CVM replication uses the cloud underlay. (2) Overlay — Flow Virtual Networking (FVN) runs on top, providing VPCs, subnets, and floating IPs to VMs just like on-prem. For connecting NC2 to on-prem: VPN or Direct Connect/Azure ExpressRoute to the cloud VNet, then VNet peering or transit gateway to extend on-prem L3 to NC2. Flow overlay can span on-prem + NC2 clusters, so a VM in a VPC on-prem and a VM in the same VPC on NC2 are in the same L2 — useful for live migration across the hybrid boundary.",
    keyFacts: [
      "Underlay = AWS/Azure native SDN (VPC/VNet)",
      "Overlay = Flow VPCs across NC2 + on-prem",
      "VPN / Direct Connect / ExpressRoute to extend on-prem L3",
      "Flow overlay can span on-prem + NC2 (live migration across hybrid)",
    ],
    networkBridge:
      "NC2 underlay is the cloud provider's VPC/VNet — same VPC peering + transit gateway design you'd use for any hybrid cloud. The Flow overlay is the same FVN you run on-prem.",
    gotcha:
      "AWS/Azure native network ACLs and security groups apply to NC2 underlay traffic. If you block UDP 6081 in a security group, FVN GENEVE overlay traffic between NC2 and on-prem will fail.",
    docRef: "NC2 Networking Guide",
  },
  {
    id: "xi-cloud",
    term: "Xi Cloud Services",
    module: "hybrid-cloud",
    difficulty: "Intermediate",
    short:
      "Nutanix-hosted cloud for running workloads without owning Nutanix hardware — Xi Leap is part of Xi Cloud.",
    detail:
      "Xi Cloud is Nutanix's hosted cloud platform — Nutanix owns the hardware in regional datacenters; you consume it as a service. Xi Cloud services include: Xi Leap (DR-as-a-service), Xi Frame (Desktop-as-a-Service, now part of Nutanix), and Xi Bits (object storage). Xi Cloud is multi-tenant — you get a dedicated PC instance, but the underlying hardware is shared with other tenants (with Nutanix-managed isolation). Use cases: cloud-only deployment (no on-prem), DR target (Xi Leap), ephemeral environments (test/dev in cloud). Xi Cloud is consumed on a per-VM-hour or per-GB-month basis, similar to AWS/Azure pricing.",
    keyFacts: [
      "Nutanix-hosted cloud; no on-prem hardware required",
      "Services: Xi Leap (DR), Xi Frame (DaaS), Xi Bits (objects)",
      "Multi-tenant with Nutanix-managed isolation",
      "Per-VM-hour / per-GB-month consumption pricing",
    ],
    networkBridge:
      "Xi Cloud ≈ AWS / Azure / GCP — same IaaS consumption model, but the platform is Nutanix HCI instead of native cloud hypervisor. Useful when your apps are Nutanix-native and you want cloud economics.",
    gotcha:
      "Xi Cloud is region-limited — check available regions before architecting. Latency-sensitive workloads may need a region close to your users.",
    docRef: "Xi Cloud Services Guide",
  },
  {
    id: "clusters-cloud",
    term: "Clusters (Multi-Cloud Management)",
    module: "hybrid-cloud",
    difficulty: "Intermediate",
    short:
      "Single-pane management across on-prem Nutanix, NC2 (AWS/Azure), and Xi Cloud clusters.",
    detail:
      "'Clusters' is the multi-cloud management view inside Prism Central. Once you register your on-prem clusters, NC2 clusters, and Xi Cloud clusters under one PC, they all appear in the 'Clusters' tab — same UI, same RBAC, same categories. You can: search across all clusters, deploy Calm blueprints across hybrid, apply Flow policies across hybrid, run reports across hybrid. The key benefit: one operational plane. Day-2 operations (patch, monitor, alert) are unified — you don't need separate tools for on-prem vs cloud. Clusters can be filtered by category (e.g. 'Env=Prod', 'Region=US-East') for policy targeting.",
    keyFacts: [
      "Single-pane management: on-prem + NC2 + Xi Cloud",
      "Same RBAC, categories, Flow policies across hybrid",
      "Cross-cluster Calm blueprint deployment",
      "Unified alerts + reports across hybrid",
    ],
    networkBridge:
      "Clusters view ≈ Cisco DCNM / VMware Cloud Foundation across hybrid — same unified operational plane, just for Nutanix platforms.",
    gotcha:
      "Network latency between PC and remote clusters affects UI responsiveness. For globally-distributed deployments, consider regional PCs with hierarchical rollup.",
    docRef: "Prism Central — 'Clusters View'",
  },
];

// Helper functions
export function conceptsByModule(moduleId: ModuleId): Concept[] {
  return concepts.filter((c) => c.module === moduleId);
}

export function moduleById(id: ModuleId): Module | undefined {
  return modules.find((m) => m.id === id);
}

// ───────────────────────────── QUIZ QUESTIONS ─────────────────────────────

export interface QuizQuestion {
  id: string;
  module: ModuleId | "mixed";
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // ─── FOUNDATIONS ───
  {
    id: "q-found-1",
    module: "foundations",
    difficulty: "Foundational",
    question:
      "What is the role of the Controller VM (CVM) on a Nutanix node?",
    options: [
      "It runs the user VMs (compute scheduler)",
      "It owns the local disks and exposes them as iSCSI back to the hypervisor",
      "It is the cluster-wide metadata broker only",
      "It is the Prism UI web server",
    ],
    correctIndex: 1,
    explanation:
      "The CVM takes ownership of the node's local disks (PCIe passthrough on AHV) and exposes them as iSCSI targets back to the local hypervisor. The hypervisor then boots user VMs from those iSCSI-backed datastores.",
  },
  {
    id: "q-found-2",
    module: "foundations",
    difficulty: "Foundational",
    question:
      "A 3-node cluster with RF=2 can survive how many simultaneous node failures without data loss?",
    options: ["0", "1", "2", "3"],
    correctIndex: 1,
    explanation:
      "RF=2 means 2 copies of every block on 2 different nodes. With 3 nodes, losing 1 leaves 2 copies (still RF=2 satisfied). Losing 2 nodes simultaneously risks data loss because the remaining single node has only 1 copy of some data.",
  },
  {
    id: "q-found-3",
    module: "foundations",
    difficulty: "Foundational",
    question: "What hypervisor does AHV use under the hood?",
    options: ["VMware ESXi", "Microsoft Hyper-V", "KVM on a hardened CentOS kernel", "Xen"],
    correctIndex: 2,
    explanation:
      "AHV is Nutanix's native hypervisor: a hardened, minimal CentOS Linux running KVM with QEMU for device emulation. It ships with AOS at no extra license cost.",
  },
  {
    id: "q-found-4",
    module: "foundations",
    difficulty: "Foundational",
    question:
      "When AOS is upgraded, what gets upgraded in a single operation?",
    options: [
      "Only the CVM software",
      "Only the hypervisor",
      "The CVM, the hypervisor, and (where applicable) firmware — all version-tested together",
      "Only Prism Central, not the clusters",
    ],
    correctIndex: 2,
    explanation:
      "AOS upgrades are coordinated: CVM, hypervisor, and firmware are upgraded in one operation, all version-tested together. This is a major operational difference vs traditional 3-tier stacks.",
  },
  {
    id: "q-found-5",
    module: "foundations",
    difficulty: "Intermediate",
    question:
      "What happens to VMs on a host when that host's CVM reboots?",
    options: [
      "All VMs on the host crash",
      "VMs stay up — the hypervisor fails over iSCSI sessions to peer CVMs",
      "VMs are live-migrated to other hosts automatically",
      "The host reboots with the CVM",
    ],
    correctIndex: 1,
    explanation:
      "VMs stay up. The hypervisor detects the local CVM is unavailable and redirects IO to peer CVMs over the storage network. The storage network must be sized for this failover scenario.",
  },

  // ─── STORAGE (DSF) ───
  {
    id: "q-stor-1",
    module: "storage",
    difficulty: "Foundational",
    question: "What does the OpLog do in DSF?",
    options: [
      "It is the persistent cold-storage tier",
      "It is the SSD-resident journal that absorbs synchronous writes before they are flushed to the Extent Store",
      "It is the metadata ring that stores fingerprints",
      "It is the read cache for hot data",
    ],
    correctIndex: 1,
    explanation:
      "OpLog is the write-absorbing journal on SSD. Synchronous writes are acked to the VM only after being written to the local OpLog AND replicated to peer OpLogs on (RF-1) other nodes — guaranteeing durability.",
  },
  {
    id: "q-stor-2",
    module: "storage",
    difficulty: "Intermediate",
    question:
      "What is the capacity saving of EC-X 4+2 vs RF2?",
    options: [
      "EC-X 4+2 uses ~50% less raw capacity than RF2",
      "EC-X 4+2 uses ~25% less raw capacity than RF2 (1.5x vs 2x)",
      "EC-X 4+2 uses the same raw capacity as RF2",
      "EC-X 4+2 uses 2x more raw capacity than RF2",
    ],
    correctIndex: 1,
    explanation:
      "RF2 consumes 2x raw capacity (2 full copies). EC-X 4+2 consumes 1.5x raw capacity (4 data blocks + 2 parity blocks per stripe). That's a 25% saving.",
  },
  {
    id: "q-stor-3",
    module: "storage",
    difficulty: "Intermediate",
    question:
      "What is the minimum cluster size required for EC-X 4+2?",
    options: ["3 nodes", "4 nodes", "6 nodes", "8 nodes"],
    correctIndex: 2,
    explanation:
      "EC-X 4+2 stripes data across 6 failure domains (4 data + 2 parity). The cluster must have at least 6 nodes so that each stripe element lands on a different node.",
  },
  {
    id: "q-stor-4",
    module: "storage",
    difficulty: "Foundational",
    question:
      "Which of the following is true about storage containers?",
    options: [
      "A storage container can have multiple RF settings — one per VM",
      "RF, dedup, compression, and EC-X are configured per storage container",
      "A storage container is the same as a LUN",
      "Each cluster can have only one storage container",
    ],
    correctIndex: 1,
    explanation:
      "A storage container is the unit of storage policy: RF, dedup, compression, EC-X, encryption, and AD-based access control are all set per container. A typical cluster has 2-4 containers for different tiers of service.",
  },
  {
    id: "q-stor-5",
    module: "storage",
    difficulty: "Advanced",
    question:
      "A thin-provisioned VM has been deleting many files internally, but cluster free space doesn't increase. Why?",
    options: [
      "Thin provisioning is broken",
      "The guest must issue TRIM/UNMAP AND Curator must run to reclaim space",
      "Space reclamation only runs during AOS upgrades",
      "Free space is not reported accurately in Prism",
    ],
    correctIndex: 1,
    explanation:
      "DSF is log-structured. Deleted file blocks inside the guest are not reclaimed until the guest issues TRIM/UNMAP (which frees the LBA-to-physical mapping) AND a Curator scan runs to garbage-collect the unreferenced physical blocks.",
  },

  // ─── AHV NETWORKING ───
  {
    id: "q-ahv-1",
    module: "ahv-networking",
    difficulty: "Foundational",
    question: "What virtual switch does AHV use?",
    options: ["VMware VDS", "Linux bridge only", "Open vSwitch (OVS)", "Cisco AVS"],
    correctIndex: 2,
    explanation:
      "AHV uses Open vSwitch (OVS) as its virtual switch. Configuration is exposed via Prism but stored as OVSDB records; you can also inspect with `ovs-vsctl show` from the AHV shell.",
  },
  {
    id: "q-ahv-2",
    module: "ahv-networking",
    difficulty: "Intermediate",
    question:
      "You create a VM vNIC with VLAN 100 in Access mode. What does the wire see?",
    options: [
      "Untagged frames — OVS adds VLAN 100 tag on ingress to the uplink",
      "802.1Q-tagged frames with VLAN 100",
      "Frames with double tags (QinQ)",
      "No traffic egresses — access mode drops traffic",
    ],
    correctIndex: 0,
    explanation:
      "In Access mode, the vNIC sees untagged frames; OVS adds the VLAN tag on ingress to the physical uplink. This is equivalent to a Cisco switchport in access mode.",
  },
  {
    id: "q-ahv-3",
    module: "ahv-networking",
    difficulty: "Intermediate",
    question: "What is the default bond mode on AHV?",
    options: ["LACP (balance-tcp)", "active-backup", "balance-slb", "round-robin"],
    correctIndex: 1,
    explanation:
      "active-backup is the default: one NIC active, others standby, no switch configuration required. Failover takes ~1-3 seconds. LACP and balance-slb must be explicitly configured.",
  },
  {
    id: "q-ahv-4",
    module: "ahv-networking",
    difficulty: "Intermediate",
    question:
      "Why must jumbo frames (MTU 9000) be enabled end-to-end on the storage network?",
    options: [
      "Because the CVM only supports MTU 9000",
      "A single 1500-byte hop silently halves throughput due to TCP fragmentation",
      "Because switch ports are required to be 9000 by spec",
      "Jumbo frames are optional and have no effect on throughput",
    ],
    correctIndex: 1,
    explanation:
      "Without jumbo end-to-end, the storage network tops out around 5-7 Gb/s on a 10 GbE link due to TCP segmentation overhead. With MTU 9000 everywhere, the same link saturates at ~9.5 Gb/s. A single 1500-byte hop causes silent fallback.",
  },
  {
    id: "q-ahv-5",
    module: "ahv-networking",
    difficulty: "Foundational",
    question:
      "Which statement about the Nutanix storage network is correct?",
    options: [
      "It must be routable to the internet for replication",
      "It should be RFC 1918, no gateway, L2-only — like an isolated SAN VLAN",
      "It is the same as the management network by default",
      "It uses TCP port 22 only",
    ],
    correctIndex: 1,
    explanation:
      "The storage network should be RFC 1918 (private), no gateway (L2-only), and treated like an isolated SAN VLAN. CVMs communicate on L2 — routing it adds attack surface and complexity.",
  },

  // ─── PRISM ───
  {
    id: "q-prism-1",
    module: "prism",
    difficulty: "Foundational",
    question: "What is the difference between Prism Element and Prism Central?",
    options: [
      "Prism Element is for storage; Prism Central is for compute",
      "Prism Element manages one cluster; Prism Central manages many clusters as one platform",
      "Prism Element is the CLI; Prism Central is the GUI",
      "They are the same product with different names",
    ],
    correctIndex: 1,
    explanation:
      "Prism Element (PE) is per-cluster — every cluster has one. Prism Central (PC) is the multi-cluster management plane that aggregates PEs and is required for Flow, Calm, Karbon, Files multi-cluster, and Objects.",
  },
  {
    id: "q-prism-2",
    module: "prism",
    difficulty: "Intermediate",
    question:
      "Why are Categories required for Flow Network Security (micro-segmentation)?",
    options: [
      "Because Flow uses them as the source/dest selectors in policies",
      "Because Flow stores policies inside category objects",
      "Because Categories are the only RBAC scope",
      "Categories are not actually required for Flow",
    ],
    correctIndex: 0,
    explanation:
      "Flow policies match on category pairs (e.g. 'App=Web can talk to App=App on TCP 443'). Without categories on VMs, you cannot write a Flow policy. Categories are the universal tag system driving Flow, Calm, RBAC, and reporting.",
  },
  {
    id: "q-prism-3",
    module: "prism",
    difficulty: "Intermediate",
    question:
      "Which of the following is a recommended best practice for Prism RBAC?",
    options: [
      "Assign roles directly to individual users",
      "Assign roles to AD/SAML groups, not individual users",
      "Use only the local 'admin' account for everything",
      "Disable RBAC entirely in production",
    ],
    correctIndex: 1,
    explanation:
      "Always assign roles to AD/SAML groups, not individual users. When employees join/leave, AD group membership changes — PC inherits the change on the next token refresh (~30 min). User-based assignments require manual cleanup.",
  },
  {
    id: "q-prism-4",
    module: "prism",
    difficulty: "Foundational",
    question: "How is the Prism Element UI made highly available?",
    options: [
      "It runs on a dedicated PE VM that fails over to another host",
      "It uses a VIP that floats across CVMs — the VIP moves to a healthy CVM on failure",
      "It is hosted on Prism Central only",
      "It is not HA — if the active CVM dies, the UI is down",
    ],
    correctIndex: 1,
    explanation:
      "PE is reached via a VIP (Virtual IP) that floats across CVMs. If the CVM hosting the VIP fails, another CVM takes over the VIP — typically within seconds. The VIP must be on the management VLAN.",
  },

  // ─── FLOW ───
  {
    id: "q-flow-1",
    module: "flow",
    difficulty: "Foundational",
    question:
      "Which encapsulation protocol does Flow Virtual Networking use for the overlay?",
    options: ["VXLAN", "GENEVE (UDP/6081)", "STT", "NVGRE"],
    correctIndex: 1,
    explanation:
      "Flow uses GENEVE (RFC 8926, UDP/6081) for overlay encapsulation. GENEVE replaces VXLAN because it supports variable-length TLV options for richer metadata.",
  },
  {
    id: "q-flow-2",
    module: "flow",
    difficulty: "Intermediate",
    question:
      "What is a Flow 'Floating IP'?",
    options: [
      "An IP that dynamically moves between VMs based on load",
      "An external IP that DNATs to a VM's private VPC IP — bound to the VM, survives live migration",
      "The IP of the Flow virtual router",
      "The DHCP-leased IP for the VM",
    ],
    correctIndex: 1,
    explanation:
      "A floating IP is an external IP DNAT'd to the VM's private VPC IP. The key benefit vs traditional DNAT: it follows the VM across hosts during live migration — no ARP gymnastics, no switch reconfiguration.",
  },
  {
    id: "q-flow-3",
    module: "flow",
    difficulty: "Intermediate",
    question:
      "What does SNAT on a VPC external subnet provide?",
    options: [
      "Per-VM external IP for inbound traffic",
      "Egress for all VMs in the VPC via one router IP (PAT-style)",
      "DNS resolution for the VPC",
      "Encryption for east-west traffic",
    ],
    correctIndex: 1,
    explanation:
      "SNAT (enabled by default on VPC external subnets) rewrites source IPs so all VMs in the VPC egress via one router IP — like Cisco PAT. Inbound uses floating IPs (per-VM DNAT).",
  },
  {
    id: "q-flow-4",
    module: "flow",
    difficulty: "Intermediate",
    question:
      "What is the recommended deployment strategy before enforcing Flow Network Security policies?",
    options: [
      "Apply all policies in 'enforce' mode immediately",
      "Run in 'monitor' mode (log all hits) for 1-2 weeks to catch missing policies",
      "Disable Flow entirely for the first month",
      "Only enforce policies on weekends",
    ],
    correctIndex: 1,
    explanation:
      "Start with 'monitor' mode for 1-2 weeks — Flow logs all policy hits without enforcing. This catches missing policies before they break production. Then switch to 'enforce' mode.",
  },
  {
    id: "q-flow-5",
    module: "flow",
    difficulty: "Advanced",
    question:
      "If the underlay network is 1500-byte MTU, what happens to VM MTU in a Flow VPC?",
    options: [
      "VM MTU stays at 1500 — Flow strips GENEVE overhead",
      "VM MTU is auto-clamped to 1450 (GENEVE adds ~50 bytes)",
      "VM MTU is auto-clamped to 1400",
      "GENEVE adds no overhead — VM MTU stays at 1500 with no impact",
    ],
    correctIndex: 1,
    explanation:
      "GENEVE adds ~50 bytes of overhead. With a 1500-byte underlay, the VM-facing MTU must be 1450 to avoid fragmentation. VMs that hardcode MTU 1500 will silently drop large packets. Enable jumbo on the underlay to keep VM MTU at 1500.",
  },

  // ─── DATA SERVICES ───
  {
    id: "q-ds-1",
    module: "data-services",
    difficulty: "Foundational",
    question: "Which Nutanix data service provides S3-compatible object storage?",
    options: ["Nutanix Files", "Nutanix Volumes", "Nutanix Objects", "Nutanix Era"],
    correctIndex: 2,
    explanation:
      "Nutanix Objects exposes an S3 API endpoint. Works with aws-cli, boto3, s3cmd — point clients at the Objects URL with access/secret keys.",
  },
  {
    id: "q-ds-2",
    module: "data-services",
    difficulty: "Foundational",
    question:
      "Which Nutanix data service provides iSCSI block storage to external hosts?",
    options: ["Nutanix Files", "Nutanix Volumes (ABS)", "Nutanix Objects", "Nutanix Era"],
    correctIndex: 1,
    explanation:
      "Nutanix Volumes (formerly ABS) exposes DSF-backed storage as iSCSI LUNs to external hosts (physical SQL, Oracle RAC, Hyper-V CSV). Always use MPIO with at least two paths.",
  },
  {
    id: "q-ds-3",
    module: "data-services",
    difficulty: "Intermediate",
    question:
      "What protocol does Nutanix Files serve to clients?",
    options: [
      "iSCSI only",
      "S3 only",
      "SMB 2/3 and NFS v3/v4.1",
      "FCoE",
    ],
    correctIndex: 2,
    explanation:
      "Files serves SMB 2/3 (with continuous availability) and NFS v3/v4.1. It replaces Windows File Server clusters and traditional NAS filers for general-purpose workloads.",
  },
  {
    id: "q-ds-4",
    module: "data-services",
    difficulty: "Advanced",
    question:
      "What is the storage cost of an Era database clone immediately after creation?",
    options: [
      "Equal to the source database (full copy)",
      "Half of the source database",
      "Zero — clones are writeable DSF snapshots, no extra space until changes",
      "10% of the source database (metadata only)",
    ],
    correctIndex: 2,
    explanation:
      "Era clones are writeable DSF snapshots. The clone initially consumes zero extra space; new space is allocated only when the clone is modified. Note: actively-modified clones can balloon storage.",
  },

  // ─── OPERATIONS ───
  {
    id: "q-ops-1",
    module: "operations",
    difficulty: "Intermediate",
    question: "What does Nutanix Calm primarily orchestrate?",
    options: [
      "Storage replication",
      "Multi-VM application blueprints with Day-2 actions across on-prem and cloud",
      "AOS upgrades",
      "Network micro-segmentation policies",
    ],
    correctIndex: 1,
    explanation:
      "Calm is application orchestration: blueprints define multi-VM apps (VM specs, networks, install scripts, Day-2 actions like scale-out/in and runbooks). Blueprints can deploy to AHV, AWS, Azure, VMware, GCP.",
  },
  {
    id: "q-ops-2",
    module: "operations",
    difficulty: "Intermediate",
    question: "What is Nutanix Move used for?",
    options: [
      "Moving CVMs between hosts",
      "Migrating VMs from ESXi, Hyper-V, AWS, Azure to Nutanix AHV",
      "Moving storage between containers",
      "Live-migrating VMs between clusters",
    ],
    correctIndex: 1,
    explanation:
      "Move migrates VMs from source hypervisors (ESXi, Hyper-V, AWS, Azure, physical via vCenter Converter) to Nutanix AHV. Supports bulk migration, delta sync, VMDK→QCOW2 format conversion, and network remapping.",
  },
  {
    id: "q-ops-3",
    module: "operations",
    difficulty: "Advanced",
    question: "What CNI does Nutanix Kubernetes Engine (NKE) use by default?",
    options: ["Flannel", "Calico", "Cilium", "Weave Net"],
    correctIndex: 2,
    explanation:
      "NKE uses Cilium as the default CNI — eBPF-based networking and security. Nutanix CSI is used for persistent volumes, kubeadm under the hood, CNCF-conformant.",
  },
  {
    id: "q-ops-4",
    module: "operations",
    difficulty: "Intermediate",
    question: "What RPO does Nutanix Cloud Disaster Recovery (NCDR / Xi Leap) typically provide?",
    options: [
      "~1 second (synchronous)",
      "~15 minutes (asynchronous, near-continuous)",
      "~24 hours (daily snapshots)",
      "~1 week (weekly replication)",
    ],
    correctIndex: 1,
    explanation:
      "NCDR replicates asynchronously with ~15 min RPO typical. RTO is 5-15 min when VMs are spun up at the DR target. Supports runbooks, test failover, planned migration, and failback.",
  },
  {
    id: "q-ops-5",
    module: "operations",
    difficulty: "Foundational",
    question: "What is Nutanix Guest Tools (NGT) used for?",
    options: [
      "Updating the hypervisor kernel",
      "In-guest agent for VSS snapshots, static IP customization, file-level restore",
      "Backing up the CVM",
      "Migrating VMs between clusters",
    ],
    correctIndex: 1,
    explanation:
      "NGT is an in-guest agent (Windows + Linux) enabling VSS-aware snapshots, static IP customization during cloning, file-level restore, and self-service reboot. Communicates with CVM over mgmt ports 2070-2080.",
  },

  // ─── HYBRID CLOUD ───
  {
    id: "q-hc-1",
    module: "hybrid-cloud",
    difficulty: "Intermediate",
    question: "What is NC2?",
    options: [
      "Nutanix's CLI tool",
      "Nutanix software running on AWS / Azure bare-metal — same AOS, same Prism",
      "A network protocol used between CVMs",
      "Nutanix's Kubernetes engine",
    ],
    correctIndex: 1,
    explanation:
      "NC2 (Nutanix Cloud Clusters) deploys Nutanix software on AWS bare-metal / Azure dedicated hosts. Same AOS, AHV, Prism, Flow, Calm as on-prem. Can be managed by the same PC across hybrid.",
  },
  {
    id: "q-hc-2",
    module: "hybrid-cloud",
    difficulty: "Advanced",
    question:
      "If you block UDP 6081 in an AWS security group attached to NC2, what breaks?",
    options: [
      "Nothing — security groups don't affect Nutanix",
      "iSCSI traffic between CVMs",
      "GENEVE overlay traffic for Flow VPCs between NC2 and on-prem",
      "Prism UI access",
    ],
    correctIndex: 2,
    explanation:
      "AWS/Azure security groups apply to NC2 underlay traffic. UDP 6081 is GENEVE — blocking it breaks Flow overlay traffic between NC2 and on-prem clusters in the same VPC.",
  },
  {
    id: "q-hc-3",
    module: "hybrid-cloud",
    difficulty: "Intermediate",
    question: "Which of the following is true about Xi Cloud?",
    options: [
      "Xi Cloud is the same as NC2 on AWS",
      "Xi Cloud is Nutanix-hosted (multi-tenant); no on-prem hardware required",
      "Xi Cloud requires you to buy Nutanix hardware",
      "Xi Cloud is on-prem only",
    ],
    correctIndex: 1,
    explanation:
      "Xi Cloud is Nutanix-hosted cloud: Nutanix owns hardware in regional datacenters; you consume it multi-tenant. Xi Leap (DRaaS), Xi Frame (DaaS), Xi Bits (objects) are services on Xi Cloud.",
  },

  // ─── MIXED / CROSS-MODULE ───
  {
    id: "q-mix-1",
    module: "mixed",
    difficulty: "Intermediate",
    question:
      "A user asks you to provision a 3-tier web app on Nutanix with Day-2 scale-out actions. Which tool should you use?",
    options: ["Nutanix Move", "Nutanix Calm", "Nutanix Era", "Nutanix Files"],
    correctIndex: 1,
    explanation:
      "Calm is the application orchestration platform — define the 3-tier app as a blueprint with scale-out/scale-in Day-2 actions. Move is migration; Era is DBaaS; Files is file serving.",
  },
  {
    id: "q-mix-2",
    module: "mixed",
    difficulty: "Intermediate",
    question:
      "Which Nutanix feature requires Prism Central to function? (Select the most complete answer.)",
    options: [
      "Prism Element only",
      "Flow Network Security, Calm, Karbon, Files multi-cluster, Objects",
      "CVM operations",
      "AHV Live Migration",
    ],
    correctIndex: 1,
    explanation:
      "PC is required for: Flow Network Security (micro-seg), Calm (orchestration), Karbon (K8s), Files multi-cluster management, and Objects (S3). Single-cluster operations like PE, CVM, AHV Live Migration do not require PC.",
  },
  {
    id: "q-mix-3",
    module: "mixed",
    difficulty: "Advanced",
    question:
      "You want to apply a security policy: 'VMs tagged App=Web can talk to VMs tagged App=Db only on TCP 5432.' Which Nutanix feature implements this?",
    options: [
      "AHV Access Mode VLANs",
      "Flow Network Security (micro-segmentation) with category-pair policies",
      "Prism RBAC projects",
      "Calm blueprints",
    ],
    correctIndex: 1,
    explanation:
      "Flow Network Security policies match on category pairs ('App=Web → App=Db on TCP 5432') and are enforced in the hypervisor data path. This is the canonical micro-segmentation use case.",
  },
];

// ───────────────────────────── BRIDGE GUIDE ─────────────────────────────

export interface BridgeEntry {
  id: string;
  category: string;
  networkConcept: string;
  networkDesc: string;
  nutanixEquivalent: string;
  nutanixDesc: string;
  mapping: string; // how the concepts map
}

export const bridgeGuide: BridgeEntry[] = [
  {
    id: "b-1",
    category: "Switching",
    networkConcept: "Cisco access port",
    networkDesc:
      "A switchport configured with `switchport mode access` and one VLAN — frames egress untagged.",
    nutanixEquivalent: "AHV vNIC in Access mode",
    nutanixDesc:
      "A VM vNIC attached to an AHV 'network' object with one VLAN — traffic egresses the uplink untagged; OVS adds the tag.",
    mapping:
      "Identical semantics: one VLAN, untagged on the wire. Access mode is the default for AHV vNICs.",
  },
  {
    id: "b-2",
    category: "Switching",
    networkConcept: "Cisco trunk port (802.1Q)",
    networkDesc:
      "`switchport mode trunk` — multiple VLANs, 802.1Q tagged on the wire, optional native VLAN.",
    nutanixEquivalent: "AHV vNIC in Trunk / Native mode",
    nutanixDesc:
      "A VM vNIC that passes multiple VLANs; the VM is responsible for 802.1Q tagging. Native mode allows one VLAN to be untagged on egress.",
    mapping:
      "Same 802.1Q semantics. Used for router/firewall VMs that need to receive multiple VLANs.",
  },
  {
    id: "b-3",
    category: "Switching",
    networkConcept: "Switchport VLAN (access VLAN 100)",
    networkDesc:
      "The VLAN number assigned to a switchport — frames are tagged with this VLAN internally.",
    nutanixEquivalent: "AHV network object (VLAN 100 on br0)",
    nutanixDesc:
      "A Prism 'network' object that references bridge br0 with VLAN 100 tagging. VMs attach to this network object.",
    mapping:
      "Network object = VLAN-tagged port group on top of a bridge. Multiple network objects can share one bridge with different VLANs.",
  },
  {
    id: "b-4",
    category: "Link Aggregation",
    networkConcept: "Cisco EtherChannel (LACP, 802.3ad)",
    networkDesc:
      "`channel-group X mode active` — LACP negotiation, per-flow load balancing across links.",
    nutanixEquivalent: "AHV bond in balance-tcp (LACP) mode",
    nutanixDesc:
      "OVS bond of two or more physical NICs, balance-tcp mode, requires switch-side LACP. Best bandwidth, sub-second failover.",
    mapping:
      "Same protocol (802.3ad), same per-flow distribution. Switch-side LACP config is identical.",
  },
  {
    id: "b-5",
    category: "Link Aggregation",
    networkConcept: "Cisco EtherChannel (mode on, no LACP)",
    networkDesc:
      "`channel-group X mode on` — static aggregation, no LACP negotiation, all links active.",
    nutanixEquivalent: "AHV bond in balance-slb mode",
    nutanixDesc:
      "OVS bond with per-VM-MAC load balancing across uplinks; no switch protocol required.",
    mapping:
      "balance-slb is the closest equivalent — per-source-MAC distribution without LACP. Useful when switch doesn't support LACP or for dual-switch active-active.",
  },
  {
    id: "b-6",
    category: "Link Aggregation",
    networkConcept: "Active-standby NIC teaming (no LACP)",
    networkDesc:
      "One NIC active, others standby; failover takes 1-3 seconds; no switch protocol required.",
    nutanixEquivalent: "AHV bond in active-backup mode (default)",
    nutanixDesc:
      "Default AHV bond mode: one NIC active, others standby, failover 1-3 seconds, no switch config required.",
    mapping:
      "Identical semantics. Best for dual-switch deployments where LACP across two switches isn't possible (requires MC-LAG).",
  },
  {
    id: "b-7",
    category: "Layer 2",
    networkConcept: "VXLAN overlay (BGP EVPN)",
    networkDesc:
      "Encapsulates L2 frames over L3 underlay using VXLAN (UDP/4789); 24-bit VNI; common in modern DC fabrics.",
    nutanixEquivalent: "Flow VPC with GENEVE overlay",
    nutanixDesc:
      "Encapsulates L2/L3 frames over L3 underlay using GENEVE (UDP/6081); 24-bit VNI; spans AHV clusters.",
    mapping:
      "GENEVE is the successor to VXLAN (RFC 8926 vs RFC 7348). Same overlay model, slightly different protocol. Underlay design principles are identical.",
  },
  {
    id: "b-8",
    category: "Layer 3",
    networkConcept: "VRF (Virtual Routing & Forwarding)",
    networkDesc:
      "Multiple isolated routing tables on one router; overlapping IP spaces allowed.",
    nutanixEquivalent: "Flow VPC (Virtual Private Cloud)",
    nutanixDesc:
      "An overlay network with its own virtual router, subnets, route table, and NAT rules. Overlapping IP spaces across VPCs.",
    mapping:
      "VPC is the SDN equivalent of a VRF: isolated IP space, isolated routing. The virtual router inside the VPC is the equivalent of the VRF's routing instance.",
  },
  {
    id: "b-9",
    category: "Layer 3",
    networkConcept: "PAT (overload NAT)",
    networkDesc:
      "`ip nat inside source list X interface gi0/0 overload` — many inside IPs, one outside IP, per-session port mapping.",
    nutanixEquivalent: "Flow VPC SNAT on external subnet",
    nutanixDesc:
      "All VMs in the VPC egress via the virtual router's external IP — source IP rewritten, per-session port mapping.",
    mapping:
      "Identical model. SNAT is enabled by default on Flow VPC external subnets; disable only if every VM has its own floating IP.",
  },
  {
    id: "b-10",
    category: "Layer 3",
    networkConcept: "Static NAT (1:1)",
    networkDesc:
      "`ip nat inside source static 10.0.0.5 203.0.113.5` — one outside IP maps to one inside IP.",
    nutanixEquivalent: "Flow Floating IP (per-VM DNAT)",
    nutanixDesc:
      "An external IP DNAT'd to a VM's private VPC IP. Bound to the VM, not the host — survives live migration.",
    mapping:
      "Floating IP = static NAT. The unique feature: it follows the VM across hosts during live migration, which router-side static NAT cannot do.",
  },
  {
    id: "b-11",
    category: "Security",
    networkConcept: "ACL (access-control list on interface)",
    networkDesc:
      "Permit/deny rules applied on a router or switch interface; filters traffic in hardware.",
    nutanixEquivalent: "Flow Network Security policy",
    nutanixDesc:
      "Micro-segmentation policy enforced in the hypervisor (OVS data path) — source category, dest category, ports, action.",
    mapping:
      "FNS is east-west ACLs in software, per-VM rather than per-interface. The category model is more flexible than IP-based ACLs.",
  },
  {
    id: "b-12",
    category: "Security",
    networkConcept: "Zone-based firewall (Cisco ZBF)",
    networkDesc:
      "Policies between zones (inside, outside, DMZ); traffic between zones is filtered; intra-zone allowed by default.",
    nutanixEquivalent: "Flow Network Security with category zones",
    nutanixDesc:
      "Categories (e.g. App=Web, App=App, App=Db) define 'zones'; policies between category pairs filter traffic.",
    mapping:
      "Same zone-based model. Default FNS = allow all until isolation applied (same as ZBF default 'permit intra-zone').",
  },
  {
    id: "b-13",
    category: "Management",
    networkConcept: "Cisco DCNM / APIC-EM",
    networkDesc:
      "Multi-device network management platform — discovers devices, configures via templates, monitors.",
    nutanixEquivalent: "Prism Central (PC)",
    nutanixDesc:
      "Multi-cluster management plane — discovers PEs, applies categories/policies, monitors across hybrid.",
    mapping:
      "PC : PE :: DCNM : switch. PC manages many clusters as one platform; PE is the per-cluster manager.",
  },
  {
    id: "b-14",
    category: "Management",
    networkConcept: "Cisco device management IP (single switch)",
    networkDesc:
      "The IP you SSH/SNMP to on a single switch — VLAN 1 SVI or dedicated mgmt interface.",
    nutanixEquivalent: "Prism Element (per-cluster management)",
    nutanixDesc:
      "Per-cluster UI/CLI/API — https://<cluster-vip>:9440. VIP-backed for HA (floats across CVMs).",
    mapping:
      "PE = the single-device manager. PC = the multi-device manager. Same split as switch IP vs DCNM.",
  },
  {
    id: "b-15",
    category: "Storage Networking",
    networkConcept: "iSCSI SAN",
    networkDesc:
      "Block storage served via iSCSI (TCP/3260) over a dedicated storage VLAN; MPIO for HA.",
    nutanixEquivalent: "Nutanix Volumes (ABS) and the internal CVM-to-hypervisor iSCSI loop",
    nutanixDesc:
      "DSF exposes iSCSI to the hypervisor (loop) and to external hosts (Volumes). Both use standard iSCSI + MPIO.",
    mapping:
      "Same protocol (iSCSI), same MPIO best practices. The difference: the 'SAN' is distributed across CVMs, not a dual-controller array.",
  },
  {
    id: "b-16",
    category: "Storage Networking",
    networkConcept: "FC SAN zoning",
    networkDesc:
      "Logical isolation of which initiators can see which targets via zones; enforced in fabric.",
    nutanixEquivalent: "Storage container AD-based access control",
    nutanixDesc:
      "Per-container policy controls which hosts/VMs can mount; enforced by the CVM.",
    mapping:
      "Container access = zoning for the software-defined SAN. Use containers + AD to scope what each host can see.",
  },
  {
    id: "b-17",
    category: "Storage Networking",
    networkConcept: "Jumbo frames on iSCSI VLAN (MTU 9000)",
    networkDesc:
      "End-to-end MTU 9000 on storage VLAN for iSCSI throughput — switch ports, server NICs, array.",
    nutanixEquivalent: "Jumbo frames on Nutanix storage network (MTU 9000)",
    nutanixDesc:
      "End-to-end MTU 9000 on the Nutanix storage VLAN — switch ports, AHV bonds, CVM storage interface. Mandatory for production throughput.",
    mapping:
      "Identical requirement, identical MTU value. `ping -M do -s 8972 <peer>` is the validation tool in both worlds.",
  },
  {
    id: "b-18",
    category: "DR & HA",
    networkConcept: "HSRP / VRRP (FHRP)",
    networkDesc:
      "Virtual IP shared between routers; one active, others standby; failover on missed hellos.",
    nutanixEquivalent: "Prism Element VIP",
    nutanixDesc:
      "Virtual IP shared between CVMs; one CVM active; VIP floats to another CVM on failure (sub-second).",
    mapping:
      "Same first-hop redundancy model. PE VIP is HSRP for the management plane — one IP, floating across CVMs.",
  },
];
