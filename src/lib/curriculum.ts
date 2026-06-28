// Nutanix Bootcamp Curriculum
// ~30 lessons: 10 networking fundamentals + 20 Nutanix
// Each lesson: theory + key terms + 2-3 exercises of mixed types
// All facts drawn from publicly available Nutanix official documentation
// and standard networking references (RFCs, Cisco guides).

// ============================================================
// TYPES
// ============================================================

export type ExerciseType =
  | "mcq"
  | "fill-blank"
  | "flashcard"
  | "scenario"
  | "command-sim"
  | "diagram";

export interface MCQExercise {
  type: "mcq";
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FillBlankExercise {
  type: "fill-blank";
  id: string;
  prompt: string; // use ___ for the blank
  acceptableAnswers: string[]; // case-insensitive match
  hint?: string;
  explanation: string;
}

export interface FlashcardExercise {
  type: "flashcard";
  id: string;
  front: string;
  back: string;
}

export interface ScenarioExercise {
  type: "scenario";
  id: string;
  prompt: string;
  // A branching decision tree. Each step shows a scenario, the user picks
  // an option, and we either move to the next step or mark done.
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
    nextStepId?: string; // if correct, advance to this step (or finish if undefined)
  }[];
}

export interface CommandSimExercise {
  type: "command-sim";
  id: string;
  prompt: string;
  // The expected command (or close variants) the user should type
  expectedCommands: string[]; // any of these accepted (case-insensitive, trimmed)
  hint?: string;
  // Output to show after correct command
  expectedOutput: string;
  // Initial context shown before the prompt
  context?: string;
  explanation: string;
}

export interface DiagramExercise {
  type: "diagram";
  id: string;
  prompt: string;
  // Slots that need to be filled with labels
  slots: {
    id: string;
    label: string; // e.g. "Slot A"
    correctLabelId: string; // which label goes here
    description: string;
  }[];
  // Pool of labels to drag from
  labels: {
    id: string;
    text: string;
  }[];
  explanation: string;
}

export type Exercise =
  | MCQExercise
  | FillBlankExercise
  | FlashcardExercise
  | ScenarioExercise
  | CommandSimExercise
  | DiagramExercise;

export interface Lesson {
  id: string;
  module: ModuleId;
  title: string;
  subtitle: string;
  duration: string; // e.g. "10 min"
  xp: number;
  // Theory content — array of paragraphs (each rendered as a <p>)
  theory: {
    heading?: string;
    body: string;
    callout?: { type: "info" | "warning" | "tip"; text: string };
  }[];
  keyTerms: { term: string; definition: string }[];
  exercises: Exercise[];
}

export type ModuleId =
  | "net-fundamentals"
  | "nutanix-foundations"
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
  shortTitle: string;
  icon: string; // lucide icon name
  color: string; // accent color name from our palette
  description: string;
}

// ============================================================
// MODULES
// ============================================================

export const modules: Module[] = [
  {
    id: "net-fundamentals",
    title: "Networking Fundamentals",
    shortTitle: "Networking",
    icon: "Network",
    color: "cyan",
    description:
      "Start from zero. Learn how data moves across networks: the OSI model, IP addressing, switching, VLANs, routing, NAT, DNS, and firewalls. These concepts are the foundation everything else in Nutanix builds on.",
  },
  {
    id: "nutanix-foundations",
    title: "Nutanix Platform Foundations",
    shortTitle: "Foundations",
    icon: "Server",
    color: "violet",
    description:
      "What Nutanix is, why HCI changed the datacenter, and the building blocks: Controller VM, AHV hypervisor, AOS, clusters, and replication factor.",
  },
  {
    id: "storage",
    title: "Distributed Storage Fabric",
    shortTitle: "Storage",
    icon: "Database",
    color: "emerald",
    description:
      "How Nutanix turns local disks in every node into a single shared pool. Storage pools, containers, OpLog, Extent Store, EC-X, and data reduction.",
  },
  {
    id: "ahv-networking",
    title: "AHV Networking",
    shortTitle: "AHV Net",
    icon: "Network",
    color: "sky",
    description:
      "Apply your networking fundamentals to AHV: Open vSwitch, bridges, VLAN tagging, bond modes, IPAM, and the all-important jumbo frames rule.",
  },
  {
    id: "prism",
    title: "Prism Management",
    shortTitle: "Prism",
    icon: "LayoutDashboard",
    color: "amber",
    description:
      "The management plane. Prism Element vs Prism Central, categories, RBAC, image management, alerts, and analysis.",
  },
  {
    id: "flow",
    title: "Flow Network Virtualization",
    shortTitle: "Flow",
    icon: "Shield",
    color: "rose",
    description:
      "Nutanix's SDN stack: VPCs, micro-segmentation, floating IPs, NAT, GENEVE overlay. The bridge from traditional networking to software-defined.",
  },
  {
    id: "data-services",
    title: "Data Services",
    shortTitle: "Data",
    icon: "HardDrive",
    color: "teal",
    description:
      "Files (NAS), Volumes (block), Objects (S3), and Era (DBaaS). When to use each, and how they relate to the underlying DSF.",
  },
  {
    id: "operations",
    title: "Operations & Automation",
    shortTitle: "Ops",
    icon: "Workflow",
    color: "indigo",
    description:
      "Day-2 operations: Calm for orchestration, Move for migration, Karbon for Kubernetes, Xi Leap for DR-as-a-service.",
  },
  {
    id: "hybrid-cloud",
    title: "Hybrid & Multi-Cloud",
    shortTitle: "Hybrid",
    icon: "Cloud",
    color: "orange",
    description:
      "Running Nutanix outside your datacenter: NC2 on AWS/Azure, Xi Cloud, and the single-pane management across hybrid.",
  },
];

export function moduleById(id: ModuleId): Module | undefined {
  return modules.find((m) => m.id === id);
}

// ============================================================
// LESSONS — Networking Fundamentals (10)
// ============================================================

export const lessons: Lesson[] = [
  // ─── MODULE 1: NETWORKING FUNDAMENTALS ──────────────────
  {
    id: "net-01",
    module: "net-fundamentals",
    title: "What Is a Network? OSI Model Explained",
    subtitle: "Start from zero — the 7 layers that explain every network",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Why we need a model",
        body: "A network is just two or more devices that can talk to each other and exchange data. That sounds simple, but in practice it involves a lot of moving parts: the physical wire, the electrical signals on the wire, the way data is chopped into packets, the addresses that decide where packets go, the application that sends and receives them. To make sense of all this, engineers use the OSI model — a 7-layer framework that breaks networking into manageable pieces. Each layer has a specific job and only talks to the layer directly above and below it.",
      },
      {
        heading: "The 7 layers (top to bottom)",
        body: "Layer 7 — Application: what the user sees (HTTP, DNS, SSH). Layer 6 — Presentation: encoding, encryption, compression (TLS lives here). Layer 5 — Session: keeps a conversation open between two endpoints. Layer 4 — Transport: chops data into segments, ensures delivery (TCP) or fires-and-forgets (UDP). Layer 3 — Network: routes packets across networks using IP addresses. Layer 2 — Data Link: moves frames between directly-connected devices using MAC addresses (Ethernet, Wi-Fi). Layer 1 — Physical: the actual wire, fiber, or radio signal carrying bits. A common memory trick: 'All People Seem To Need Data Processing' — Application, Presentation, Session, Transport, Network, Data Link, Physical.",
      },
      {
        heading: "How layers work together",
        body: "When you open a website, your browser (Layer 7) asks the transport layer (Layer 4) to open a TCP connection to the server. TCP breaks the request into segments and hands them to IP (Layer 3), which puts source and destination IP addresses on each segment and routes them. At each hop, the packet is wrapped in an Ethernet frame (Layer 2) with source and destination MAC addresses, then encoded as electrical signals on the wire (Layer 1). On the receiving end, the process reverses — Layer 1 picks up the signal, Layer 2 reads the frame, Layer 3 routes it, Layer 4 reassembles the segments, and Layer 7 hands the response to the browser.",
        callout: {
          type: "tip",
          text: "When troubleshooting, isolate the problem to a layer. 'Can you ping the IP?' tests Layer 3. 'Can you resolve the name?' tests Layer 7 (DNS). 'Is the link up?' tests Layers 1-2.",
        },
      },
      {
        heading: "Why this matters for Nutanix",
        body: "Nutanix is a networked platform — every component (CVM, hypervisor, VM, Prism) communicates over IP. Knowing the OSI model helps you read packet captures, design network segmentation, and troubleshoot issues like 'why won't this VM talk to its gateway' (Layer 3) vs 'why is replication slow' (Layer 2 MTU) vs 'why can't I reach Prism' (Layer 7 HTTPS). The rest of this bootcamp will reference these layers constantly.",
      },
    ],
    keyTerms: [
      { term: "OSI Model", definition: "7-layer framework (Application, Presentation, Session, Transport, Network, Data Link, Physical) describing how networked systems communicate." },
      { term: "Encapsulation", definition: "Each layer wraps the data from the layer above with its own header (and sometimes trailer) before sending it down." },
      { term: "PDU", definition: "Protocol Data Unit — the name for data at each layer: Segments (L4), Packets (L3), Frames (L2), Bits (L1)." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-01-ex-1",
        prompt: "At which OSI layer does IP (Internet Protocol) operate?",
        options: ["Layer 2 — Data Link", "Layer 3 — Network", "Layer 4 — Transport", "Layer 7 — Application"],
        correctIndex: 1,
        explanation: "IP operates at Layer 3 (Network). It's responsible for routing packets between networks using IP addresses. Layer 2 uses MAC addresses, Layer 4 uses ports, Layer 7 is the application itself.",
      },
      {
        type: "fill-blank",
        id: "net-01-ex-2",
        prompt: "TCP chops data into ___ at Layer 4, which IP then encapsulates into packets at Layer 3.",
        acceptableAnswers: ["segments", "segment"],
        hint: "Starts with 's', plural form",
        explanation: "At Layer 4 (Transport), TCP divides data into segments. Each segment gets a sequence number so the receiver can reassemble them in order. UDP also operates at Layer 4 but uses datagrams instead of segments.",
      },
      {
        type: "flashcard",
        id: "net-01-ex-3",
        front: "What does the OSI mnemonic 'All People Seem To Need Data Processing' stand for?",
        back: "Layer 7 Application, Layer 6 Presentation, Layer 5 Session, Layer 4 Transport, Layer 3 Network, Layer 2 Data Link, Layer 1 Physical — top to bottom.",
      },
    ],
  },

  {
    id: "net-02",
    module: "net-fundamentals",
    title: "IP Addresses, Subnets, and CIDR",
    subtitle: "How devices find each other on a network",
    duration: "15 min",
    xp: 10,
    theory: [
      {
        heading: "What is an IP address",
        body: "An IP address is a unique number that identifies a device on a network. The most common version is IPv4 — a 32-bit number usually written as four decimal numbers separated by dots, like 192.168.1.10. Each of those four numbers is between 0 and 255 (because 8 bits = 256 values). That gives about 4.3 billion unique IPv4 addresses, which sounds like a lot but ran out years ago — hence the move to IPv6 (128-bit, way more addresses).",
      },
      {
        heading: "Network vs host portion",
        body: "An IP address has two parts: the network portion (which network am I on?) and the host portion (which device on that network am I?). The split point is defined by the subnet mask. For example, with IP 192.168.1.10 and mask 255.255.255.0, the first three octets (192.168.1) are the network, and the last octet (.10) is the host. Every device on the same network has the same network portion — so 192.168.1.5, 192.168.1.10, and 192.168.1.200 are all on the same network and can talk directly to each other.",
      },
      {
        heading: "CIDR notation",
        body: "Writing subnet masks as 255.255.255.0 is verbose. CIDR (Classless Inter-Domain Routing) notation is shorter: /24 means the first 24 bits are the network portion. So 192.168.1.10/24 means the same as 192.168.1.10 with mask 255.255.255.0. Common CIDR blocks: /8 = 255.0.0.0 (16 million hosts), /16 = 255.255.0.0 (65k hosts), /24 = 255.255.255.0 (254 hosts), /30 = 255.255.255.252 (2 hosts, used for point-to-point links).",
        callout: {
          type: "info",
          text: "A /24 has 256 addresses total, but only 254 usable. The first (.0) is the network address, the last (.255) is the broadcast address.",
        },
      },
      {
        heading: "Private vs public IPs",
        body: "Not all IP addresses are routable on the internet. RFC 1918 reserves three ranges for private use: 10.0.0.0/8 (16M hosts), 172.16.0.0/12 (1M hosts), and 192.168.0.0/16 (65K hosts). Every home router, corporate LAN, and Nutanix cluster uses these. To reach the internet, private IPs go through NAT (Network Address Translation) — covered in a later lesson. Nutanix clusters typically use 192.168.5.x for their internal storage network — RFC 1918, never routable to the internet, perfect for the storage replication plane.",
      },
      {
        heading: "Subnetting in practice",
        body: "Suppose you have a /24 (192.168.1.0/24) and need to split it into 4 smaller subnets. Each /26 (255.255.255.192) gives you 64 addresses / 62 usable. So you'd have 192.168.1.0/26, 192.168.1.64/26, 192.168.1.128/26, 192.168.1.192/26. This is exactly how a Nutanix cluster separates management traffic (one subnet), storage traffic (another subnet), and VM traffic (often multiple VLANs). When you plan a Nutanix deployment, you decide these subnet boundaries up front.",
      },
    ],
    keyTerms: [
      { term: "IPv4", definition: "32-bit IP address written as four decimal octets (e.g. 192.168.1.10). About 4.3 billion addresses total." },
      { term: "Subnet Mask", definition: "Defines which part of an IP is the network vs the host. 255.255.255.0 = /24 in CIDR." },
      { term: "CIDR", definition: "Classless Inter-Domain Routing — slash notation for subnet masks. /24 = first 24 bits are network." },
      { term: "RFC 1918", definition: "Reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 as private (non-internet-routable) address space." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-02-ex-1",
        prompt: "How many usable host addresses does a /24 subnet provide?",
        options: ["256", "254", "255", "128"],
        correctIndex: 1,
        explanation: "A /24 has 256 total addresses, but the first (.0) is the network address and the last (.255) is the broadcast address — both reserved. That leaves 254 usable hosts.",
      },
      {
        type: "fill-blank",
        id: "net-02-ex-2",
        prompt: "The CIDR notation /16 is equivalent to the subnet mask 255.___.0.0",
        acceptableAnswers: ["255", "255.255"],
        hint: "Two octets of 255, then two of 0",
        explanation: "/16 means 16 bits of network = 255.255.0.0. The first two octets are all 1s (network), the last two are all 0s (host). This gives 65,534 usable hosts per subnet.",
      },
      {
        type: "diagram",
        id: "net-02-ex-3",
        prompt: "Match each CIDR block to its correct subnet mask. Drag the masks to the right slots.",
        slots: [
          { id: "slot-a", label: "/8", correctLabelId: "lab-8", description: "Class A — 16M hosts" },
          { id: "slot-b", label: "/16", correctLabelId: "lab-16", description: "Class B — 65K hosts" },
          { id: "slot-c", label: "/24", correctLabelId: "lab-24", description: "Class C — 254 hosts" },
          { id: "slot-d", label: "/30", correctLabelId: "lab-30", description: "Point-to-point — 2 hosts" },
        ],
        labels: [
          { id: "lab-8", text: "255.0.0.0" },
          { id: "lab-16", text: "255.255.0.0" },
          { id: "lab-24", text: "255.255.255.0" },
          { id: "lab-30", text: "255.255.255.252" },
        ],
        explanation: "/8 = 8 network bits = 255.0.0.0. /16 = 16 bits = 255.255.0.0. /24 = 24 bits = 255.255.255.0. /30 = 30 bits = 255.255.255.252 (only 2 usable, used for router-to-router links).",
      },
    ],
  },

  {
    id: "net-03",
    module: "net-fundamentals",
    title: "Switches, MAC Addresses, and Layer 2",
    subtitle: "How devices on the same network talk to each other",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Layer 2 — the local network",
        body: "Layer 2 of the OSI model is where devices on the same physical network talk to each other. The addressing scheme at Layer 2 is MAC addresses — a 48-bit number, usually written as six hex pairs like 00:1A:2B:3C:4D:5E. Every network interface card (NIC) has a globally unique MAC burned in at the factory. MAC addresses don't route across the internet — they're only meaningful within a single Layer 2 segment (a single switch or a single VLAN).",
      },
      {
        heading: "What a switch does",
        body: "A switch is a Layer 2 device that connects multiple devices on the same network. When you plug four computers into a 4-port switch, they can all talk to each other. The switch learns which MAC address is on which port by looking at the source MAC of incoming frames — it builds a MAC address table (also called a CAM table). When a frame arrives destined for a known MAC, the switch forwards it only out that port. When the destination MAC is unknown or is the broadcast address (FF:FF:FF:FF:FF:FF), the switch floods it out all ports except the one it came in on.",
        callout: {
          type: "info",
          text: "Switches don't look at IP addresses — they only care about MAC. This is why a switch is faster and cheaper than a router.",
        },
      },
      {
        heading: "ARP — bridging Layer 3 to Layer 2",
        body: "Here's the puzzle: applications work with IP addresses (Layer 3), but the actual frame delivery on the local network uses MAC addresses (Layer 2). How does the sender know what MAC address corresponds to a given IP? Answer: ARP (Address Resolution Protocol). When computer A wants to talk to 192.168.1.5, it sends an ARP broadcast asking 'who has 192.168.1.5? Tell 192.168.1.10'. The device with that IP replies with its MAC, and A caches the answer in its ARP table for a few minutes. Now A can build Ethernet frames addressed to that MAC.",
      },
      {
        heading: "Hubs vs switches vs routers",
        body: "A hub (mostly obsolete) is a Layer 1 device — it just repeats every signal out every port, no intelligence. A switch is Layer 2 — it learns MAC addresses and forwards intelligently. A router is Layer 3 — it forwards packets between different networks based on IP addresses. In a modern datacenter: switches connect servers in the same rack or VLAN; routers (often Layer 3 switches doing routing) connect different VLANs or different sites. Nutanix nodes plug into Top-of-Rack switches; the ToR switches route between VLANs and up to the datacenter core.",
      },
    ],
    keyTerms: [
      { term: "MAC Address", definition: "48-bit hardware address burned into a NIC, written as six hex pairs (00:1A:2B:3C:4D:5E). Used at Layer 2." },
      { term: "Switch", definition: "Layer 2 device that connects devices on the same network. Learns MAC addresses and forwards frames only where needed." },
      { term: "ARP", definition: "Address Resolution Protocol. Resolves an IP address to a MAC address on the local network via broadcast." },
      { term: "Broadcast Domain", definition: "The set of devices that receive a broadcast frame. A single VLAN is one broadcast domain." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-03-ex-1",
        prompt: "What protocol does a device use to discover the MAC address associated with a given IP on its local network?",
        options: ["DNS", "DHCP", "ARP", "TCP"],
        correctIndex: 2,
        explanation: "ARP (Address Resolution Protocol) resolves IPs to MACs. The sender broadcasts 'who has IP X?' and the owner replies with its MAC. The result is cached in the ARP table.",
      },
      {
        type: "mcq",
        id: "net-03-ex-2",
        prompt: "What does a Layer 2 switch use to decide where to forward a frame?",
        options: ["Destination IP address", "Destination MAC address", "TCP port number", "URL"],
        correctIndex: 1,
        explanation: "Switches look only at MAC addresses (Layer 2). They build a MAC table by learning source MACs of incoming frames, then forward based on destination MAC. If the destination is unknown or broadcast (FF:FF:FF:FF:FF:FF), the frame is flooded out all ports.",
      },
      {
        type: "fill-blank",
        id: "net-03-ex-3",
        prompt: "The MAC broadcast address is FF:FF:FF:FF:FF:___.",
        acceptableAnswers: ["ff", "FF"],
        explanation: "The broadcast MAC is FF:FF:FF:FF:FF:FF (all 1s in binary). Frames sent to this address are delivered to every device in the same broadcast domain (same VLAN).",
      },
    ],
  },

  {
    id: "net-04",
    module: "net-fundamentals",
    title: "VLANs — Virtual LANs Explained",
    subtitle: "Splitting one switch into multiple logical networks",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "The problem VLANs solve",
        body: "Imagine a 48-port switch with servers from three different departments plugged in: HR, Engineering, and Finance. Without VLANs, all 48 ports are in one big broadcast domain — every ARP request, every DHCP discovery, every broadcast frame hits every device. Security is also a concern: any device can ARP-spoof any other. The solution: Virtual LANs (VLANs). A VLAN splits one physical switch into multiple logical switches. Ports 1-16 might be VLAN 10 (HR), ports 17-32 VLAN 20 (Engineering), ports 33-48 VLAN 30 (Finance). Devices in different VLANs can't talk to each other unless a router forwards between them.",
      },
      {
        heading: "802.1Q tagging",
        body: "When you have multiple switches and need VLAN 10 to span both, you use a trunk link between them. A trunk carries multiple VLANs by tagging each frame with its VLAN ID using the IEEE 802.1Q standard. The tag is a 4-byte header inserted into the Ethernet frame, containing a 12-bit VLAN ID (so VLAN numbers range from 1 to 4094). On a trunk port, frames leave the switch tagged; on an access port (where a single-VLAN device plugs in), frames are untagged — the switch adds/removes the tag internally. This is exactly how Nutanix AHV carries multiple VLANs to VMs: the physical switchport is a trunk, AHV's OVS strips/adds tags per VM vNIC.",
        callout: {
          type: "info",
          text: "VLAN 1 is the default VLAN on most switches. Best practice: don't use VLAN 1 for production traffic — use it for management only, or disable it entirely.",
        },
      },
      {
        heading: "Access vs trunk vs native",
        body: "Three port modes you'll see on any managed switch: Access port — carries one VLAN, frames are untagged on the wire. Used for end-user devices, servers, and AHV VM vNICs in 'Access mode'. Trunk port — carries multiple VLANs, frames are tagged with 802.1Q. Used between switches, to routers, and to hypervisors. Native VLAN — on a trunk, frames on this one VLAN are untagged. The default native VLAN is 1, but best practice is to set it to an unused VLAN. Nutanix AHV supports all three modes on VM vNICs — the same 802.1Q semantics, just enforced by software (Open vSwitch) instead of an ASIC.",
      },
      {
        heading: "Inter-VLAN routing",
        body: "VLANs isolate Layer 2, but applications often need to talk across VLANs (Engineering needs to reach the HR portal, for instance). For that you need a Layer 3 device — a router or a Layer 3 switch — to forward packets between VLANs. The router has a virtual interface (SVI — Switch Virtual Interface) in each VLAN with an IP address; devices in that VLAN use the SVI IP as their default gateway. The router then routes between SVIs. This is called 'router-on-a-stick' if it's a single router with subinterfaces on a trunk, or just 'inter-VLAN routing' if it's an L3 switch doing it in hardware.",
      },
    ],
    keyTerms: [
      { term: "VLAN", definition: "Virtual LAN — logical separation of devices on a switch. Each VLAN is its own broadcast domain." },
      { term: "802.1Q", definition: "IEEE standard for VLAN tagging. Inserts a 4-byte header with a 12-bit VLAN ID (range 1-4094) into Ethernet frames." },
      { term: "Access Port", definition: "Switchport carrying one VLAN; frames are untagged on the wire." },
      { term: "Trunk Port", definition: "Switchport carrying multiple VLANs; frames are tagged with 802.1Q. Used between switches and to hypervisors." },
      { term: "Native VLAN", definition: "On a trunk, the one VLAN whose frames are untagged. Default is VLAN 1." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-04-ex-1",
        prompt: "What does an 802.1Q tag contain that lets a trunk link carry multiple VLANs?",
        options: ["A 12-bit VLAN ID", "A MAC address", "An IP address", "A TCP port"],
        correctIndex: 0,
        explanation: "802.1Q inserts a 4-byte header into the Ethernet frame, including a 12-bit VLAN ID. 12 bits = 4096 values, but 0 and 4095 are reserved, so usable VLAN IDs are 1-4094.",
      },
      {
        type: "scenario",
        id: "net-04-ex-2",
        prompt: "You're configuring a switch port for a Nutanix AHV host's uplink. The host needs to receive traffic for VLANs 100 (mgmt), 200 (storage), and 300-310 (VM traffic).",
        steps: [
          {
            id: "step-1",
            text: "What mode should the switchport be configured as?",
            options: [
              { id: "a", text: "Access port in VLAN 100", correct: false, feedback: "Access ports carry only one VLAN. The host needs many VLANs.", nextStepId: undefined },
              { id: "b", text: "Trunk port allowing VLANs 100, 200, 300-310", correct: true, feedback: "Correct! Trunk ports carry multiple VLANs with 802.1Q tagging. You'd configure: switchport mode trunk + switchport trunk allowed vlan 100,200,300-310.", nextStepId: undefined },
              { id: "c", text: "Trunk port with native VLAN 100", correct: false, feedback: "Native VLAN 100 would make mgmt traffic untagged — usually you want mgmt tagged too for clarity.", nextStepId: undefined },
            ],
          },
        ],
      },
      {
        type: "flashcard",
        id: "net-04-ex-3",
        front: "On a trunk port, what is the 'native VLAN'?",
        back: "The one VLAN whose frames are sent untagged on the wire. Default is VLAN 1, but best practice is to set it to an unused VLAN for security. The switch expects frames on this VLAN to have no 802.1Q tag.",
      },
    ],
  },

  {
    id: "net-05",
    module: "net-fundamentals",
    title: "Routers, Gateways, and Layer 3 Routing",
    subtitle: "How packets cross from one network to another",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "What routing actually does",
        body: "Switches forward frames within a single network (Layer 2). Routers forward packets between different networks (Layer 3). When computer A on network 192.168.1.0/24 wants to talk to computer B on network 10.0.0.0/8, A's TCP/IP stack looks at the destination IP, realizes B is on a different network (because the network portions don't match), and sends the packet to its default gateway — a router interface on A's local network. The router receives the packet, looks at the destination IP, checks its routing table to find the next hop, and forwards the packet onward. This repeats at each router until the packet reaches B's network.",
      },
      {
        heading: "Default gateway",
        body: "Every device that talks beyond its local subnet has a default gateway configured — the IP of a router interface on its local network. When the device needs to send a packet to a destination that isn't on its local subnet, it ARPs for the gateway's MAC and sends the frame to the gateway. The gateway then routes the packet. If you can ping your gateway but not 8.8.8.8, your Layer 2 is fine but your routing (or upstream) is broken. If you can't ping your gateway, your Layer 1/2 is broken — check the cable, switchport, or VLAN config.",
        callout: {
          type: "tip",
          text: "On a Nutanix cluster, every component has a gateway except the storage network. Storage should be L2-only — no gateway — because CVMs only need to talk to each other.",
        },
      },
      {
        heading: "Routing tables",
        body: "A router's brain is its routing table — a list of (destination network, next hop, interface) entries. When a packet arrives, the router looks up the destination IP in the table and forwards to the matching next hop. If multiple entries match, the router uses the longest prefix match — the entry with the most specific (longest) subnet mask wins. So if the table has both 0.0.0.0/0 (default route, points to internet) and 10.0.0.0/8 (points to corporate WAN), a packet to 10.1.2.3 matches the /8 (more specific) and goes to the WAN, not the internet.",
      },
      {
        heading: "Static vs dynamic routing",
        body: "Static routes are manually configured: 'to reach network X, send to next-hop Y'. Simple, predictable, no protocol overhead — but doesn't adapt to failures. Dynamic routing protocols (OSPF, BGP, IS-IS, EIGRP) let routers automatically learn routes from each other and reconverge when topology changes. In a small datacenter, you might just use static routes. In a large enterprise or service provider network, you'll use OSPF internally and BGP for internet/upstream. Nutanix Flow Virtual Networking can integrate with BGP for VPC route advertisement — covered in the Flow module.",
      },
    ],
    keyTerms: [
      { term: "Router", definition: "Layer 3 device that forwards packets between different networks based on destination IP." },
      { term: "Default Gateway", definition: "The IP address (of a router interface) where a device sends packets destined for other networks." },
      { term: "Routing Table", definition: "List of (destination network, next hop, interface) entries a router uses to forward packets." },
      { term: "Longest Prefix Match", definition: "When multiple routes match a destination, the one with the longest subnet mask (most specific) wins." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-05-ex-1",
        prompt: "A computer can ping its default gateway but cannot ping 8.8.8.8. What is most likely broken?",
        options: ["Layer 1 (cable)", "Layer 2 (switchport/VLAN)", "Layer 3 routing upstream of the gateway", "Layer 7 (DNS)"],
        correctIndex: 2,
        explanation: "If you can ping your gateway, Layers 1-2 on your local segment are fine, and the gateway itself is reachable. The problem is upstream — the gateway can't route to 8.8.8.8, possibly due to a missing route, an ACL, or an ISP issue.",
      },
      {
        type: "fill-blank",
        id: "net-05-ex-2",
        prompt: "When a router has multiple matching routes for a destination, it picks the one with the ___ prefix match (most specific subnet mask).",
        acceptableAnswers: ["longest", "longer"],
        hint: "Comparing subnet mask lengths",
        explanation: "Longest prefix match: the route with the longest (most specific) subnet mask wins. A /32 (single host) beats a /24 beats a /0 (default route).",
      },
      {
        type: "scenario",
        id: "net-05-ex-3",
        prompt: "You're designing the network for a 4-node Nutanix cluster. Three networks: management (192.168.5.0/24), storage (192.168.10.0/24), and VM traffic (VLANs 100-200).",
        steps: [
          {
            id: "s1",
            text: "Should the storage network have a default gateway configured?",
            options: [
              { id: "a", text: "Yes — every network needs a gateway", correct: false, feedback: "Not true. The storage network only carries CVM-to-CVM traffic, all on the same L2 segment. No routing needed.", nextStepId: undefined },
              { id: "b", text: "No — storage should be L2-only (RFC 1918, no gateway)", correct: true, feedback: "Correct! Storage is L2-only: same subnet, no gateway, no routing. This keeps it isolated, fast, and secure.", nextStepId: undefined },
              { id: "c", text: "Only if the cluster spans multiple sites", correct: false, feedback: "Multi-site storage is a stretch cluster scenario, which is more advanced. For a standard cluster, storage is L2-only.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "net-06",
    module: "net-fundamentals",
    title: "TCP, UDP, and Ports",
    subtitle: "How applications talk to each other over the network",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Two flavors of transport",
        body: "At Layer 4, the Transport layer, there are two main protocols: TCP and UDP. They take very different approaches to delivering data. TCP (Transmission Control Protocol) is reliable and connection-oriented: it establishes a connection with a 3-way handshake, numbers every byte, acknowledges received data, retransmits lost packets, and controls send rate to avoid congestion. UDP (User Datagram Protocol) is fire-and-forget: it just sends datagrams, no handshake, no acknowledgments, no retransmission. UDP is faster and simpler, but unreliable.",
      },
      {
        heading: "When to use which",
        body: "Use TCP when reliability matters more than latency: web browsing (HTTP/HTTPS), email (SMTP, IMAP), file transfer (SFTP, SMB), database queries (SQL, PostgreSQL). The application trusts that everything sent will arrive in order, intact. Use UDP when speed matters more than perfect reliability, or when the application handles its own reliability: DNS lookups (small queries, retransmit if lost), VoIP/video (a dropped packet is just a glitch, not worth retransmitting), DHCP discovery (broadcasts), online gaming, and streaming media.",
      },
      {
        heading: "Ports — addressing the application",
        body: "An IP address gets a packet to a host, but the host might be running dozens of network applications. How does the OS know which app gets the incoming packet? Ports. A port is a 16-bit number (0-65535) that identifies a specific application or service on a host. When a web server starts, it 'listens' on port 80 (HTTP) or 443 (HTTPS). When your browser connects to https://example.com, it opens a random high-numbered source port (say 54321) and connects to destination port 443 on the server. The combination of source IP, source port, destination IP, destination port uniquely identifies a conversation — this 4-tuple is called a socket.",
        callout: {
          type: "info",
          text: "Well-known ports (0-1023): HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, RDP=3389, SMB=445. Registered ports (1024-49151). Dynamic/private ports (49152-65535) for client-side connections.",
        },
      },
      {
        heading: "Common ports you'll see in Nutanix",
        body: "Nutanix uses specific ports for its services. Prism Element UI: 9440 (HTTPS). Prism Central UI: also 9440. CVM-to-CVM storage replication: 2020 (custom). AHV SSH: 22. Nutanix Guest Tools: 2070-2080. These matter for firewall design — if you block port 9440 between your workstation and the cluster, you can't reach Prism. If you block 2020 between CVMs, replication breaks. The full port matrix is in the Nutanix Port and Info Portal documentation. Always document the ports you've allowed on firewalls between Nutanix components.",
      },
    ],
    keyTerms: [
      { term: "TCP", definition: "Transmission Control Protocol — reliable, connection-oriented Layer 4 protocol. 3-way handshake, acknowledgments, retransmission." },
      { term: "UDP", definition: "User Datagram Protocol — unreliable, connectionless Layer 4 protocol. No handshake, no retransmission. Faster, simpler." },
      { term: "Port", definition: "16-bit number (0-65535) identifying an application or service on a host. Combined with IPs, forms a socket." },
      { term: "Socket", definition: "The 4-tuple (source IP, source port, destination IP, destination port) uniquely identifying a network conversation." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-06-ex-1",
        prompt: "Which protocol would you use for a VoIP (voice over IP) call, and why?",
        options: [
          "TCP — to ensure every packet arrives",
          "UDP — low latency matters more than retransmitting dropped audio",
          "Both simultaneously",
          "ICMP — for voice",
        ],
        correctIndex: 1,
        explanation: "VoIP uses UDP. A 50ms-old voice packet is useless if retransmitted (you'd hear it 100ms late); better to drop it. TCP's retransmission and ordering would add unacceptable latency. The codec handles minor packet loss gracefully.",
      },
      {
        type: "mcq",
        id: "net-06-ex-2",
        prompt: "What port does Prism Element (the cluster management UI) listen on by default?",
        options: ["80 (HTTP)", "443 (HTTPS)", "9440 (HTTPS)", "22 (SSH)"],
        correctIndex: 2,
        explanation: "Prism Element listens on port 9440 (HTTPS). Prism Central also uses 9440. The URL is https://<cluster-vip>:9440. Port 443 is typically NOT used by Prism by default (but can be configured via a reverse proxy).",
      },
      {
        type: "fill-blank",
        id: "net-06-ex-3",
        prompt: "TCP establishes a connection using a 3-way ___ (SYN, SYN-ACK, ACK).",
        acceptableAnswers: ["handshake", "hand shake"],
        hint: "Two parties shaking on it",
        explanation: "TCP's 3-way handshake: client sends SYN, server replies SYN-ACK, client sends ACK. Only after this is the connection 'established' and data can flow. UDP skips this entirely — just sends.",
      },
    ],
  },

  {
    id: "net-07",
    module: "net-fundamentals",
    title: "NAT and PAT — Network Address Translation",
    subtitle: "How private IPs reach the internet",
    duration: "10 min",
    xp: 10,
    theory: [
      {
        heading: "Why NAT exists",
        body: "IPv4 has only 4.3 billion addresses, and they ran out years ago. Yet every home and office has dozens of devices on private (RFC 1918) IPs. How do they all reach the internet through one public IP? Network Address Translation (NAT). NAT rewrites the source IP of outgoing packets from private to public, and rewrites the destination IP of return packets back from public to private. The router performing NAT keeps a translation table tracking which inside device made which outbound connection, so return traffic gets back to the right device.",
      },
      {
        heading: "Static NAT (1:1)",
        body: "Static NAT maps one inside IP to one outside IP, permanently. Example: a web server at 10.0.0.5 inside the datacenter is mapped to public IP 203.0.113.5. Inbound traffic to 203.0.113.5:443 is rewritten to 10.0.0.5:443 and forwarded. This is how you expose an internal service to the internet. It's also how Nutanix Flow floating IPs work — except Flow does the DNAT in the hypervisor instead of on a router, so the IP follows the VM if it live-migrates.",
      },
      {
        heading: "PAT (overload NAT)",
        body: "Most home routers and small offices have only one public IP but many devices. They use Port Address Translation (PAT), also called 'overload NAT' or 'NAT overload'. PAT maps many inside IPs to one outside IP by varying the source port. When device A makes an outbound connection from source port 54321, PAT rewrites it to (public IP, random port like 35001). When device B makes a connection from source port 54321, PAT rewrites it to (public IP, different port 35002). The translation table distinguishes return traffic by destination port. This is how one home IP serves a whole family's phones, laptops, and TVs.",
        callout: {
          type: "info",
          text: "PAT is what Flow VPC SNAT does. All VMs in a VPC egress via the virtual router's external IP — many inside IPs, one outside IP, port multiplexing.",
        },
      },
      {
        heading: "NAT in the Nutanix world",
        body: "Three places NAT shows up in Nutanix: (1) Flow VPC SNAT — VMs in a VPC egress to external networks via the VPC router's external IP (PAT). (2) Flow Floating IPs — external IPs DNAT'd to specific VMs (static NAT, but follows the VM). (3) NC2 on AWS/Azure — the cloud provider's NAT Gateway handles egress for NC2 nodes. You don't need to manually configure NAT for a basic AHV cluster — VM traffic uses your existing datacenter NAT. But once you start using Flow VPCs, you'll be configuring SNAT and floating IPs explicitly.",
      },
    ],
    keyTerms: [
      { term: "NAT", definition: "Network Address Translation — rewrites source/destination IPs at a router. Lets private IPs reach the internet." },
      { term: "Static NAT", definition: "1:1 mapping of one inside IP to one outside IP. Permanent. Used for inbound services." },
      { term: "PAT", definition: "Port Address Translation (overload NAT). Many inside IPs → one outside IP, distinguished by source port." },
      { term: "DNAT", definition: "Destination NAT — rewrites the destination IP. Used for inbound (floating IP, port forwarding)." },
      { term: "SNAT", definition: "Source NAT — rewrites the source IP. Used for outbound (PAT, VPC egress)." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-07-ex-1",
        prompt: "Your home has 10 devices on private IPs but only 1 public IP from your ISP. How do all 10 reach the internet?",
        options: [
          "Static NAT (1:1 mapping)",
          "PAT (overload NAT) — many inside IPs share one outside IP via port multiplexing",
          "ARP proxy",
          "DNS round-robin",
        ],
        correctIndex: 1,
        explanation: "PAT (Port Address Translation) maps many inside IPs to one outside IP by varying the source port. Each outbound connection gets a unique (public IP, port) tuple, so return traffic can be matched back to the original device.",
      },
      {
        type: "fill-blank",
        id: "net-07-ex-2",
        prompt: "A Flow Floating IP is an example of ___ NAT (one external IP maps to one internal VM IP).",
        acceptableAnswers: ["static", "destination", "DNAT", "D NAT"],
        hint: "Direction: inbound (external → internal)",
        explanation: "Floating IPs are static DNAT — one external IP maps 1:1 to one internal VM IP. The unique feature in Flow: the mapping follows the VM across hosts during live migration, which router-side static NAT cannot do.",
      },
      {
        type: "flashcard",
        id: "net-07-ex-3",
        front: "What's the difference between SNAT and DNAT?",
        back: "SNAT rewrites the source IP — used for outbound (egress). DNAT rewrites the destination IP — used for inbound (ingress). Flow VPC SNAT handles VM egress; Flow Floating IPs handle VM ingress.",
      },
    ],
  },

  {
    id: "net-08",
    module: "net-fundamentals",
    title: "DNS — Domain Name System",
    subtitle: "How names become IP addresses",
    duration: "10 min",
    xp: 10,
    theory: [
      {
        heading: "Why DNS exists",
        body: "Humans remember names (google.com); computers use IPs (142.250.80.46). DNS is the phonebook that translates names to IPs. Without DNS, you'd be typing IPs into your browser for every website. Every networked application — web browsers, email clients, SSH, Nutanix Prism — uses DNS to find the IPs of the services it talks to. When DNS breaks, everything breaks: websites won't load, email won't deliver, and you can't reach Prism by name (only by IP).",
      },
      {
        heading: "How a DNS lookup works",
        body: "When you type google.com into your browser, your computer first checks its local DNS cache. If empty, it queries its configured DNS resolver (usually your router, your ISP's resolver, or a public resolver like 8.8.8.8). The resolver checks its cache; if empty, it does a recursive lookup: it asks the root nameservers (.) for 'com', then the .com TLD nameservers for 'google.com', then Google's authoritative nameservers for the actual record. The final answer (an A record with an IPv4 address) gets cached at every level for the record's TTL (Time To Live), so subsequent lookups are fast.",
        callout: {
          type: "info",
          text: "DNS uses UDP port 53 for normal queries (fast, small responses) and TCP port 53 for large responses (zone transfers, DNSSEC). Block port 53 and DNS breaks.",
        },
      },
      {
        heading: "Common record types",
        body: "A record — maps a name to an IPv4 address (most common). AAAA — same but IPv6. CNAME — alias from one name to another (e.g. blog.example.com → example.com). MX — mail exchange, tells mail servers where to deliver email for a domain. PTR — reverse DNS, maps an IP back to a name (used for spam checks). TXT — arbitrary text, often used for SPF/DKIM email authentication or domain ownership verification. SRV — service record, tells clients where to find a specific service (Active Directory uses these heavily).",
      },
      {
        heading: "DNS in the Nutanix world",
        body: "Nutanix clusters and PCs assume DNS works. You'll configure DNS servers on the CVM, the hypervisor, and the VMs themselves. Best practice: point Nutanix components at your enterprise DNS resolvers (often AD-integrated), which then forward to internet resolvers. Prism Central can register its name in DNS so users access it as prism.company.com instead of an IP. Flow Virtual DNS provides DNS resolution inside Flow VPCs — useful when VMs in a VPC need to find each other by name. Always ensure DNS is reachable (UDP 53) from every Nutanix component; DNS failures cause subtle, hard-to-diagnose issues like AD auth delays and certificate validation failures.",
      },
    ],
    keyTerms: [
      { term: "DNS", definition: "Domain Name System — translates human-readable names (google.com) into IP addresses." },
      { term: "A Record", definition: "Maps a name to an IPv4 address. The most common DNS record type." },
      { term: "CNAME", definition: "Canonical Name — alias from one name to another." },
      { term: "TTL", definition: "Time To Live — how long (in seconds) a resolver should cache the record before re-querying." },
      { term: "Recursive Lookup", definition: "When a resolver walks the DNS hierarchy (root → TLD → authoritative) to find an answer." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-08-ex-1",
        prompt: "Which DNS record type maps a hostname to an IPv4 address?",
        options: ["CNAME", "A", "MX", "PTR"],
        correctIndex: 1,
        explanation: "An A record maps a hostname to an IPv4 address. AAAA maps to IPv6. CNAME aliases one name to another. MX is for mail. PTR does reverse (IP → name) lookups.",
      },
      {
        type: "fill-blank",
        id: "net-08-ex-2",
        prompt: "DNS uses UDP port ___ for normal queries.",
        acceptableAnswers: ["53"],
        explanation: "DNS uses UDP port 53 for normal queries (small responses, fast) and TCP port 53 for large responses (zone transfers, DNSSEC). Both must be allowed on firewalls between clients and DNS servers.",
      },
      {
        type: "scenario",
        id: "net-08-ex-3",
        prompt: "A user reports they can't reach Prism by name (prism.company.com), but they can reach it by IP (192.168.5.10). What's the likely issue and how would you verify?",
        steps: [
          {
            id: "s1",
            text: "First step to verify?",
            options: [
              { id: "a", text: "Reboot the user's laptop", correct: false, feedback: "Rebooting is a last resort, not a diagnostic.", nextStepId: undefined },
              { id: "b", text: "Run nslookup prism.company.com from the user's laptop", correct: true, feedback: "Correct! nslookup will show whether DNS resolution is working. If it returns an IP, DNS is fine and the problem is elsewhere. If it fails, the problem is DNS.", nextStepId: undefined },
              { id: "c", text: "Reboot the Prism Central VM", correct: false, feedback: "Prism is reachable by IP — it's not down. Don't reboot working services.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "net-09",
    module: "net-fundamentals",
    title: "DHCP — Automatic IP Assignment",
    subtitle: "How devices get IPs without manual configuration",
    duration: "8 min",
    xp: 10,
    theory: [
      {
        heading: "The DHCP DORA process",
        body: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to devices when they join a network. Without DHCP, every device would need manual IP configuration — painful at scale. The DHCP process is four steps, nicknamed DORA: Discover — client broadcasts 'I need an IP' (DHCPDISCOVER). Offer — DHCP server(s) respond 'Here's an IP you can use' (DHCPOFFER). Request — client says 'I'll take that one' (DHCPREQUEST, broadcast so other servers know they didn't win). Acknowledge — server confirms 'It's yours, here's your gateway and DNS too' (DHCPACK).",
      },
      {
        heading: "Leases and reservations",
        body: "DHCP doesn't permanently assign an IP — it leases it for a period (commonly 8 hours to 8 days). When the lease is half-expired, the client tries to renew with the same server. If that server is unreachable at 87.5% expired, the client tries any DHCP server. If the lease fully expires with no renewal, the client must release the IP and start DORA again. For devices that need a stable IP (printers, servers, Nutanix CVMs), you configure a DHCP reservation — the DHCP server always offers the same IP to that specific MAC address. Reservations give you the best of both worlds: centralized management plus stable IPs.",
        callout: {
          type: "info",
          text: "DHCP uses UDP ports 67 (server) and 68 (client). It's broadcast-based, so it doesn't cross routers unless the router has a 'DHCP relay' (ip helper-address) configured.",
        },
      },
      {
        heading: "DHCP in the Nutanix world",
        body: "Nutanix AHV has a built-in DHCP server called IPAM (IP Address Management). When you create an AHV network (a VLAN-tagged object on a bridge), you can optionally enable IPAM with a subnet, IP range, and gateway. VMs that connect to that network get IPs from IPAM automatically — convenient for labs and Calm-provisioned VMs. For production, most enterprises use their existing DHCP/Infoblox server instead, leaving IPAM off. Never enable IPAM on a VLAN that already has another DHCP server — you'll create rogue DHCP conflicts. The CVM and hypervisor itself typically use static IPs (not DHCP) for stability.",
      },
    ],
    keyTerms: [
      { term: "DHCP", definition: "Dynamic Host Configuration Protocol — automatically assigns IPs, masks, gateways, and DNS to clients." },
      { term: "DORA", definition: "The 4-step DHCP process: Discover, Offer, Request, Acknowledge." },
      { term: "Lease", definition: "Time-limited IP assignment from DHCP. Client must renew before expiry." },
      { term: "Reservation", definition: "DHCP config that always assigns the same IP to a specific MAC address." },
      { term: "IPAM", definition: "Nutanix AHV's built-in DHCP server. Per-network (per VLAN) configuration." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-09-ex-1",
        prompt: "What is the correct order of the DHCP DORA process?",
        options: [
          "Discover, Offer, Request, Acknowledge",
          "Discover, Request, Offer, Acknowledge",
          "Offer, Discover, Request, Acknowledge",
          "Discover, Offer, Acknowledge, Request",
        ],
        correctIndex: 0,
        explanation: "DORA: client Discovers (broadcast), server Offers, client Requests (the chosen offer), server Acknowledges with final config. The Request is broadcast so losing servers know to release their offer.",
      },
      {
        type: "fill-blank",
        id: "net-09-ex-2",
        prompt: "DHCP uses UDP ports 67 (server) and ___ (client).",
        acceptableAnswers: ["68"],
        explanation: "Server listens on UDP 67, clients listen on UDP 68. Both ports must be allowed on any firewall between clients and DHCP server. DHCP is broadcast-based, so it doesn't cross routers unless a DHCP relay (ip helper-address) is configured.",
      },
      {
        type: "flashcard",
        id: "net-09-ex-3",
        front: "What is Nutanix IPAM and when should you avoid using it?",
        back: "IPAM is AHV's built-in DHCP server. Use it for labs, dev environments, and Calm-provisioned VMs. Avoid it in production where you already have an enterprise DHCP server (Infoblox, Windows DHCP) on the same VLAN — it'll cause rogue DHCP conflicts.",
      },
    ],
  },

  {
    id: "net-10",
    module: "net-fundamentals",
    title: "Firewalls, ACLs, and LACP",
    subtitle: "Security policies and link aggregation",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Firewalls and ACLs",
        body: "A firewall filters traffic based on rules. The simplest form is an Access Control List (ACL) — a list of permit/deny rules applied to a router or switch interface. Each rule specifies source IP, destination IP, protocol, port, and action (permit or deny). Rules are evaluated top-to-bottom; the first match wins. A common default: permit everything you explicitly need, then deny everything else (implicit deny). Firewalls add stateful inspection — they track the state of TCP connections (new, established, related) and can allow return traffic for permitted outbound connections without an explicit rule. Modern next-gen firewalls (Palo Alto, Fortinet) add application awareness, user identity, and threat detection.",
      },
      {
        heading: "Zone-based firewalls",
        body: "Managing ACLs per-interface gets complex fast. Zone-based firewalls simplify by grouping interfaces into zones (inside, outside, DMZ) and writing policies between zones. 'Inside-to-outside is allowed, outside-to-inside is denied, DMZ-to-inside requires explicit allow.' Cisco ZBF (Zone-Based Firewall) and Nutanix Flow Network Security both use this model — Flow uses 'categories' (App=Web, App=Db) as zones and writes policies between category pairs. Same model, just software-defined and tag-driven.",
        callout: {
          type: "tip",
          text: "When designing firewall rules, start with 'deny all' as the default, then add permits. This is called 'default deny' and is far more secure than 'default permit'.",
        },
      },
      {
        heading: "LACP — Link Aggregation Control Protocol",
        body: "Servers often need more bandwidth or redundancy than a single NIC provides. LACP (Link Aggregation Control Protocol, IEEE 802.3ad) lets you bundle multiple physical links into one logical link. Two 25 GbE NICs bonded with LACP give you 50 Gb/s aggregate bandwidth, plus automatic failover if one link dies. LACP negotiates the bond between the server and the switch using LACPDU messages; both sides must agree on the config. The switch distributes traffic across the links using a hash (usually source+destination MAC or IP+port) — a single conversation always uses the same link, so packets arrive in order. LACP requires switch-side configuration (Cisco: channel-group X mode active).",
      },
      {
        heading: "Bond modes you'll see in Nutanix",
        body: "AHV supports three bond modes: (1) active-backup (default) — one NIC active, others standby, no switch config needed, failover in 1-3 seconds. (2) balance-slb — per-source-MAC load balancing, no switch config needed. (3) balance-tcp (LACP, 802.3ad) — true LACP aggregation, requires switch-side LACP, best bandwidth. Recommendation: use LACP if your switch supports it; otherwise active-backup is the safest choice. For dual-switch deployments where LACP across two switches isn't possible (requires MC-LAG), use active-backup.",
      },
    ],
    keyTerms: [
      { term: "ACL", definition: "Access Control List — ordered list of permit/deny rules applied to a network interface." },
      { term: "Stateful Firewall", definition: "Firewall that tracks TCP connection state, allowing return traffic for permitted outbound without explicit rules." },
      { term: "Zone-Based Firewall", definition: "Firewall model grouping interfaces into zones (inside, outside, DMZ) with policies between zones." },
      { term: "LACP", definition: "Link Aggregation Control Protocol (802.3ad). Bundles multiple physical links into one logical link for bandwidth + redundancy." },
      { term: "Bond", definition: "Linux/OVS term for a team of physical NICs acting as one. AHV bonds support active-backup, balance-slb, and balance-tcp (LACP) modes." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "net-10-ex-1",
        prompt: "What does LACP (802.3ad) provide?",
        options: [
          "VLAN tagging between switches",
          "Bundling multiple physical links into one logical link for bandwidth + redundancy",
          "Firewall rules between zones",
          "Automatic IP assignment",
        ],
        correctIndex: 1,
        explanation: "LACP bundles multiple physical links (e.g. two 25 GbE NICs) into one logical link, giving aggregate bandwidth (50 Gb/s) plus automatic failover. Requires LACP config on both ends. On AHV, this is the 'balance-tcp' bond mode.",
      },
      {
        type: "mcq",
        id: "net-10-ex-2",
        prompt: "What is the default AHV bond mode, and what does it do?",
        options: [
          "balance-tcp (LACP) — requires switch LACP config",
          "active-backup — one NIC active, others standby, no switch config, 1-3s failover",
          "balance-slb — per-MAC load balancing",
          "round-robin — packets distributed one-by-one",
        ],
        correctIndex: 1,
        explanation: "active-backup is the default. One NIC carries all traffic; others are standby. No switch protocol required, so it works with any switch config. Failover takes 1-3 seconds. Best choice when LACP isn't possible (e.g. dual-switch without MC-LAG).",
      },
      {
        type: "fill-blank",
        id: "net-10-ex-3",
        prompt: "When designing firewall rules, the most secure default policy is 'default ___' (permit nothing unless explicitly allowed).",
        acceptableAnswers: ["deny", "denied", "block"],
        explanation: "Default deny: start by denying everything, then add explicit permits for what you need. This is far more secure than 'default permit' (allow everything, deny specific bad traffic), which is what most breached networks use.",
      },
    ],
  },

  // ─── MODULE 2: NUTANIX FOUNDATIONS ──────────────────
  {
    id: "nut-01",
    module: "nutanix-foundations",
    title: "What Is Nutanix? HCI vs Traditional Datacenter",
    subtitle: "Why hyperconverged infrastructure changed everything",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "The traditional 3-tier datacenter",
        body: "Before HCI, a datacenter had three separate tiers: compute servers (running VMware ESXi or Hyper-V), a storage array (NetApp, EMC, Pure), and a SAN network connecting them (Fibre Channel or iSCSI). Each tier was bought, managed, and patched separately. Adding capacity meant buying more compute OR more storage — and the SAN was expensive, complex, and a single point of failure. Networking between the tiers required careful design: a storage VLAN for the SAN, a management VLAN for vCenter/SSH, a VM-data VLAN for user traffic. Three separate teams (compute, storage, network) each owned their tier.",
      },
      {
        heading: "What HCI changes",
        body: "Hyperconverged Infrastructure (HCI) collapses all three tiers into a single software-defined appliance. A Nutanix node is a 1U or 2U server with CPUs, RAM, disks (SSDs + HDDs), and network interfaces — running the Nutanix AOS software stack. There's no separate storage array, no SAN, no FC switching. The disks inside each node are pooled across the cluster by software, presenting as shared storage to the hypervisor. Adding capacity is simple: add a node, which adds both compute AND storage in a fixed ratio. One team manages the whole stack. The storage network becomes the cluster's internal 10/25 GbE fabric — still important, but simplified.",
        callout: {
          type: "info",
          text: "Nutanix coined the term 'HCI' in 2011 with their first product. Today, HCI is a $30B+ market with Nutanix, VMware vSAN, HPE SimpliVity, and Cisco HyperFlex as major players.",
        },
      },
      {
        heading: "Why this matters to you",
        body: "If you're coming from a networking background, HCI simplifies your world in some ways (no SAN to design, no FC zoning) and complicates it in others (the storage network is now mission-critical for every VM IO, not just a dedicated SAN VLAN). Your networking skills translate directly: VLANs, bonds, jumbo frames, MTU — all the same concepts, applied to a slightly different architecture. The big mental shift: storage is no longer 'over there in a separate rack' — it's distributed across every node, and the network is the storage fabric. Treat the Nutanix storage network with the same care you'd treat a production SAN.",
      },
      {
        heading: "What Nutanix software actually runs",
        body: "Every Nutanix node runs three things: (1) a hypervisor — AHV (Nutanix's native KVM-based hypervisor, default and free), VMware ESXi, or Microsoft Hyper-V. (2) The Controller VM (CVM) — a special-purpose VM that owns the node's local disks and serves them as iSCSI to the hypervisor. (3) AOS (Acropolis Operating System) — the distributed storage fabric software that runs inside the CVM. These three work together: the hypervisor runs user VMs, the CVM handles storage, and AOS coordinates across CVMs to make the cluster behave as one. We'll cover each in detail in upcoming lessons.",
      },
    ],
    keyTerms: [
      { term: "HCI", definition: "Hyperconverged Infrastructure — collapses compute, storage, and networking into one software-defined appliance. No external SAN." },
      { term: "3-Tier Datacenter", definition: "Traditional architecture: separate compute servers, storage array, and SAN network. Each managed separately." },
      { term: "Node", definition: "A single Nutanix server (1U or 2U) with CPU, RAM, disks, and NICs. Multiple nodes form a cluster." },
      { term: "AOS", definition: "Acropolis Operating System — Nutanix's distributed software that runs inside the CVM and provides the storage fabric." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "nut-01-ex-1",
        prompt: "In a traditional 3-tier datacenter, what connects the compute servers to the storage array?",
        options: [
          "A SAN (Storage Area Network) using Fibre Channel or iSCSI",
          "Direct-attached USB cables",
          "The user VLAN",
          "Bluetooth",
        ],
        correctIndex: 0,
        explanation: "3-tier datacenters use a Storage Area Network (SAN) — typically Fibre Channel (FC) or iSCSI over Ethernet — to connect compute servers to a shared storage array. HCI eliminates this by putting storage inside every node and using the cluster's network as the storage fabric.",
      },
      {
        type: "fill-blank",
        id: "nut-01-ex-2",
        prompt: "Adding a node to a Nutanix cluster adds both compute AND ___ in a fixed ratio.",
        acceptableAnswers: ["storage", "disk", "disks"],
        hint: "The other thing inside a node",
        explanation: "Each node adds CPU+RAM (compute) and SSDs+HDDs (storage) in a fixed ratio. This is what 'converged' means — you can't add storage without also adding compute. The cluster scales linearly.",
      },
      {
        type: "diagram",
        id: "nut-01-ex-3",
        prompt: "Label the components of a traditional 3-tier datacenter. Drag the labels to the correct slots.",
        slots: [
          { id: "slot-a", label: "Tier 1: Runs VMs (ESXi, Hyper-V)", correctLabelId: "lab-compute", description: "The compute layer" },
          { id: "slot-b", label: "Tier 2: FC or iSCSI network", correctLabelId: "lab-san", description: "Connects compute to storage" },
          { id: "slot-c", label: "Tier 3: NetApp, EMC, Pure", correctLabelId: "lab-array", description: "Centralized storage" },
        ],
        labels: [
          { id: "lab-compute", text: "Compute Servers" },
          { id: "lab-san", text: "SAN Fabric" },
          { id: "lab-array", text: "Storage Array" },
        ],
        explanation: "Traditional 3-tier: compute servers (Tier 1) connect via SAN fabric (Tier 2) to a centralized storage array (Tier 3). HCI collapses all three into a single node running AOS.",
      },
    ],
  },

  {
    id: "nut-02",
    module: "nutanix-foundations",
    title: "The Controller VM (CVM) — Heart of Every Node",
    subtitle: "How one VM per node owns all the disks",
    duration: "10 min",
    xp: 10,
    theory: [
      {
        heading: "What the CVM is",
        body: "Every Nutanix node runs exactly one Controller VM (CVM). It's a special-purpose virtual machine that takes ownership of the node's local disks and exposes them back to the hypervisor as iSCSI targets. The hypervisor then boots user VMs from those iSCSI-backed datastores. Why this design? It cleanly separates storage management (in the CVM, running Nutanix AOS software) from the hypervisor (which just sees an iSCSI LUN). This is why Nutanix can support AHV, ESXi, and Hyper-V with the same storage stack — the CVM is hypervisor-agnostic.",
      },
      {
        heading: "How it owns the disks",
        body: "On AHV, the CVM takes ownership of the node's local disks via PCIe passthrough — it gets direct hardware access to the disk controllers, bypassing the hypervisor. On ESXi, it uses RDM (Raw Device Mapping) or paravirtualized SCSI. Either way, the hypervisor can't see the disks directly — only the CVM can. The CVM then runs the Stargate process (the actual storage engine) and exposes iSCSI targets back to the hypervisor over a loopback connection. The hypervisor mounts these as datastores and creates VM vDisks on them.",
        callout: {
          type: "info",
          text: "CVM sizing varies by node model, but a typical modern CVM is 16 vCPU and 32 GB RAM. The CVM is a real VM — you'll see it in Prism alongside user VMs.",
        },
      },
      {
        heading: "What happens when a CVM reboots",
        body: "Here's a critical operational fact: if a CVM reboots (planned maintenance, crash, AOS upgrade), the VMs on that host keep running. Why? Because the hypervisor's iSCSI sessions to the local CVM fail over to peer CVMs on other nodes. The VMs read and write through peer CVMs over the storage network until the local CVM comes back. This is why the storage network must be sized for failover scenarios, not just steady-state traffic. You can reboot a CVM during business hours without dropping VMs — but watch storage latency and network bandwidth during the failover.",
      },
      {
        heading: "How CVMs talk to each other",
        body: "All CVMs in a cluster communicate over the storage network (typically 192.168.5.x by default, but should be on its own VLAN in production). They replicate writes (per RF), serve remote reads when the local CVM doesn't have a block, rebalance data after node add/remove, and run Curator scans (background data management). The CVMs form a distributed system — the cluster's metadata lives in a ring (Cassandra on small clusters, Medusa on large) with every CVM owning a slice. If a CVM dies, the ring rebalances automatically. The CVM IPs are how everything in the cluster finds each other — never change a CVM IP casually.",
      },
    ],
    keyTerms: [
      { term: "CVM", definition: "Controller VM — special VM on every node that owns local disks and serves them as iSCSI to the hypervisor." },
      { term: "Stargate", definition: "The storage process running inside every CVM. Handles reads, writes, replication, dedup, compression." },
      { term: "PCIe Passthrough", definition: "How the CVM gets direct hardware access to disk controllers on AHV, bypassing the hypervisor." },
      { term: "Cassandra / Medusa", definition: "The distributed metadata ring storing fingerprints, RF locations, and cluster state across all CVMs." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "nut-02-ex-1",
        prompt: "What happens to user VMs on a host when that host's CVM reboots?",
        options: [
          "All VMs crash and need to be restarted",
          "VMs stay up — the hypervisor fails over iSCSI sessions to peer CVMs over the storage network",
          "VMs are live-migrated to other hosts",
          "The host reboots along with the CVM",
        ],
        correctIndex: 1,
        explanation: "VMs stay up. The hypervisor detects the local CVM is unavailable and redirects IO to peer CVMs over the storage network. VMs see slightly higher latency but no downtime. The storage network must be sized for this failover scenario.",
      },
      {
        type: "fill-blank",
        id: "nut-02-ex-2",
        prompt: "On AHV, the CVM takes ownership of local disks via ___ passthrough (direct hardware access, bypassing the hypervisor).",
        acceptableAnswers: ["PCIe", "PCI", "pci-e", "pci"],
        hint: "The high-speed bus that connects disks to CPU",
        explanation: "PCIe passthrough gives the CVM direct hardware access to the disk controllers, bypassing the hypervisor entirely. On ESXi, the equivalent is RDM (Raw Device Mapping) or paravirtualized SCSI.",
      },
      {
        type: "command-sim",
        id: "nut-02-ex-3",
        prompt: "You're on an AHV host's shell. Run the command to see all VMs on this host, including the CVM.",
        context: "AHV host shell (root@ahv#)",
        expectedCommands: ["acli vm.list", "acli vm.list"],
        hint: "Use acli — the Acropolis Command Line Interface",
        expectedOutput: `VM name           VM UUID                              State
cvm-XXX-2a3b4c5d  4c0e2a3b-4c5d-6789-abcd-ef0123456789  kRunning
webserver-01      8a1f2b3c-4d5e-6789-9abc-def012345678  kRunning
db-prod-02        2b3c4d5e-6789-abcd-ef01-23456789abcd  kRunning
windows-ad-01     3c4d5e6f-789a-bcde-f012-3456789abcde  kRunning`,
        explanation: "acli vm.list shows all VMs on the host, including the CVM (always named cvm-XXX). The CVM is a real VM — you'll see it in this list and in Prism. Other useful acli commands: acli vm.get <name>, acli vm.create, acli vm.delete.",
      },
    ],
  },

  {
    id: "nut-03",
    module: "nutanix-foundations",
    title: "AHV — The Nutanix Hypervisor",
    subtitle: "KVM-based, free, and managed through Prism",
    duration: "10 min",
    xp: 10,
    theory: [
      {
        heading: "What AHV is",
        body: "AHV (Acropolis Hypervisor) is Nutanix's native hypervisor. It's a hardened, minimal CentOS Linux running KVM (Kernel-based Virtual Machine) with QEMU for device emulation. AHV ships with AOS at no extra license cost — unlike ESXi which requires a VMware vSphere license. It's managed entirely through Prism (the Nutanix UI) or acli (the command line), so there's no separate vCenter equivalent to deploy, patch, or license. AHV has become the default choice for most new Nutanix deployments, though ESXi and Hyper-V remain supported on most hardware for customers with existing VMware/Microsoft investments.",
      },
      {
        heading: "Why KVM under the hood matters",
        body: "If you've ever run KVM on a Linux server (Ubuntu, RHEL, Proxmox), AHV will feel familiar — same KVM, same libvirt under the hood, same QEMU device model. The difference: Nutanix curates the kernel (tuned for HCI workloads), ships the drivers, and exposes management through Prism instead of virsh. The networking layer is Open vSwitch (OVS) — the same open-source vSwitch you'd see on any Linux KVM host. If you've configured OVS on Linux, you already know AHV networking; we'll cover the specifics in the AHV Networking module.",
      },
      {
        heading: "What AHV gives you",
        body: "AHV supports all the features you'd expect from a Tier-1 hypervisor: vCPU hot-add (add CPUs to a running VM), memory hot-add, live migration (called 'AHV Live Migration' — analogous to VMware vMotion), snapshots, clones, storage live-disk-migrate (move a VM's disk between containers without downtime), and affinity/anti-affinity rules (keep VMs together or apart for HA). VMs are stored as QCOW2 files on the DSF-backed datastore. The CVM is itself an AHV VM — the only special one (it has PCIe passthrough for disks).",
        callout: {
          type: "tip",
          text: "AHV patching is bundled with AOS upgrades — one click in Prism patches the CVM, AHV, and firmware together. This is a major operational difference vs ESXi, which has its own separate patching cycle.",
        },
      },
      {
        heading: "When to choose AHV vs ESXi",
        body: "Choose AHV if: you want lower licensing costs, simpler operations (one patch cycle), and tighter Nutanix integration (Flow, Calm, Karbon work best on AHV). Choose ESXi if: you already have a large VMware estate, vCenter-trained admins, or specific VMware-only workloads (some third-party appliances only run on ESXi). Choose Hyper-V if: you have a strong Microsoft investment (System Center, Windows Admin Center, Azure Stack HCI). For a fresh deployment with no legacy, AHV is almost always the right answer. Nutanix's own best-practice documentation recommends AHV for new deployments.",
      },
    ],
    keyTerms: [
      { term: "AHV", definition: "Acropolis Hypervisor — Nutanix's free, KVM-based hypervisor. Default for new deployments." },
      { term: "KVM", definition: "Kernel-based Virtual Machine — the Linux kernel module that provides virtualization. AHV runs KVM." },
      { term: "QEMU", definition: "The userspace component that emulates devices (NICs, disks, etc.) for KVM VMs." },
      { term: "AHV Live Migration", definition: "Moving a running VM from one AHV host to another without downtime. Analogous to VMware vMotion." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "nut-03-ex-1",
        prompt: "What technology does AHV use under the hood for virtualization?",
        options: ["VMware ESXi kernel", "Xen hypervisor", "KVM on a hardened CentOS kernel", "Microsoft Hyper-V"],
        correctIndex: 2,
        explanation: "AHV is a hardened CentOS Linux running KVM (Kernel-based Virtual Machine) with QEMU for device emulation. Same KVM you'd see on Ubuntu or RHEL — just curated and tuned by Nutanix.",
      },
      {
        type: "mcq",
        id: "nut-03-ex-2",
        prompt: "Which hypervisor does Nutanix recommend for fresh deployments with no existing investment?",
        options: ["VMware ESXi (familiar to most admins)", "Microsoft Hyper-V (Microsoft shop)", "AHV (free, tighter integration with Nutanix services)", "Citrix XenServer"],
        correctIndex: 2,
        explanation: "Nutanix recommends AHV for fresh deployments. It's free (no VMware license cost), patches in one cycle with AOS, and integrates best with Flow, Calm, and Karbon. ESXi remains supported for customers with existing VMware investments.",
      },
      {
        type: "fill-blank",
        id: "nut-03-ex-3",
        prompt: "AHV's live migration feature (moving a running VM between hosts without downtime) is analogous to VMware ___.",
        acceptableAnswers: ["vMotion", "vmotion", "VMotion"],
        hint: "Starts with 'v', ends with 'motion'",
        explanation: "VMware vMotion and AHV Live Migration both move a running VM's memory state and CPU to another host with sub-second downtime. Under the hood, AHV Live Migration uses QEMU's migration capability, but the user experience is identical to vMotion.",
      },
    ],
  },

  {
    id: "nut-04",
    module: "nutanix-foundations",
    title: "Clusters and Replication Factor (RF)",
    subtitle: "How Nutanix keeps your data safe",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "What a Nutanix cluster is",
        body: "A Nutanix cluster is the management and fault boundary. Minimum production cluster size is 3 nodes; the recommended size for most workloads is 4+ nodes to tolerate one node failure with RF=2 still satisfied. All nodes in a cluster share a single storage pool, a single metadata space, and a single Prism Element endpoint. Clusters can be grouped under Prism Central for cross-cluster management. The cluster is the unit of failure: if a cluster is down, all its VMs are down. Multiple clusters per site is normal — often one cluster per business unit or per tier of service.",
      },
      {
        heading: "Heartbeats and failure detection",
        body: "How does the cluster know a node has failed? CVMs ping each other over the storage network every few seconds (heartbeats). If a CVM doesn't respond to N consecutive heartbeats (default ~5 seconds), the cluster declares that node dead. The metadata ring rebalances to exclude the dead node, and any RF=2 data that only had one copy after the failure is re-replicated to another node to restore RF=2. This reconvergence happens automatically — you'll see alerts in Prism, but no manual intervention is needed unless the cluster can't find space for the new replicas.",
      },
      {
        heading: "Replication Factor (RF) explained",
        body: "Every write to Nutanix DSF is synchronously replicated across N independent nodes, where N is the Replication Factor. RF2 (default) writes two copies on two different nodes; RF3 writes three copies on three different nodes. The replicas are placed using a 'disk balanced' algorithm that considers node, block, and disk failure domains — replicas are never co-located on the same node or the same disk. The cluster must therefore contain at least RF+1 nodes to survive a node failure without losing data redundancy (RF2 needs 3 nodes minimum so that after losing 1, the data still has 2 copies).",
        callout: {
          type: "warning",
          text: "A 3-node RF2 cluster can survive ONE node failure. Two simultaneous node failures = potential data loss. For mission-critical workloads, run 4+ nodes and/or use RF3.",
        },
      },
      {
        heading: "Choosing RF2 vs RF3",
        body: "RF2 (default) is fine for most workloads — it gives you 50% usable capacity (2x raw) and tolerates one node failure. Use RF3 for mission-critical workloads where data loss is unacceptable: it gives you 33% usable capacity (3x raw) but tolerates two simultaneous node failures. RF3 is also recommended for clusters with very large nodes (because rebuilding data on a 50 TB node after a failure can take many hours, during which you're at RF1 — vulnerable). RF is set per storage container, so you can mix: a 'Mission-Critical' container at RF3 for production databases, and a 'Dev-Test' container at RF2 for everything else. Changing RF on a container triggers background re-replication that consumes storage network bandwidth — schedule during maintenance windows.",
      },
    ],
    keyTerms: [
      { term: "Cluster", definition: "Management and fault boundary for a set of Nutanix nodes. Min 3 nodes for production." },
      { term: "RF", definition: "Replication Factor — number of copies of every block. RF2 (default) = 2 copies, RF3 = 3 copies." },
      { term: "Failure Domain", definition: "A unit that can fail independently. A node is a failure domain; a block (set of nodes) is a larger one." },
      { term: "Reconvergence", definition: "Automatic cluster recovery after a node failure — metadata ring rebalances, RF is restored." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "nut-04-ex-1",
        prompt: "A 3-node cluster with RF=2 can survive how many simultaneous node failures without data loss?",
        options: ["0", "1", "2", "3"],
        correctIndex: 1,
        explanation: "RF=2 means 2 copies of every block on 2 different nodes. With 3 nodes, losing 1 leaves 2 copies (still RF=2 satisfied). Losing 2 nodes simultaneously risks data loss because the remaining single node has only 1 copy of some data.",
      },
      {
        type: "fill-blank",
        id: "nut-04-ex-2",
        prompt: "The minimum number of nodes required for an RF3 cluster is ___ (so that losing 1 still leaves 3 copies).",
        acceptableAnswers: ["4", "four"],
        hint: "RF + 1",
        explanation: "RF3 needs at least 4 nodes: 3 to hold the replicas + 1 to lose. The rule is: minimum nodes = RF + 1. RF2 → 3 nodes, RF3 → 4 nodes. For production stability, Nutanix recommends 5+ nodes for RF3.",
      },
      {
        type: "scenario",
        id: "nut-04-ex-3",
        prompt: "You're designing a 4-node Nutanix cluster for a customer. They have two workloads: a production SQL database (mission-critical) and a dev/test environment (disposable).",
        steps: [
          {
            id: "s1",
            text: "What RF should you use for each workload's storage container?",
            options: [
              { id: "a", text: "Both RF2 — simpler, more capacity", correct: false, feedback: "The customer explicitly said SQL is mission-critical. RF2 only tolerates one failure, and during rebuild you're at RF1.", nextStepId: undefined },
              { id: "b", text: "SQL = RF3 (tolerates 2 failures); Dev = RF2 (saves capacity)", correct: true, feedback: "Correct! RF is set per container. RF3 for mission-critical SQL (33% usable but tolerates 2 failures), RF2 for dev (50% usable, tolerates 1). This is the canonical Nutanix deployment pattern.", nextStepId: undefined },
              { id: "c", text: "Both RF3 — maximum safety", correct: false, feedback: "RF3 for dev wastes capacity. RF is per-container — mix and match for the right cost/safety tradeoff per workload.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  // ─── MODULE 3: STORAGE (DSF) ──────────────────
  {
    id: "sto-01",
    module: "storage",
    title: "Distributed Storage Fabric (DSF) Overview",
    subtitle: "How local disks become shared storage",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "The big picture",
        body: "DSF (Distributed Storage Fabric) is the umbrella name for Nutanix's distributed storage stack. Every CVM runs a Stargate process that owns its local disks and serves iSCSI to the local hypervisor. Writes are accepted by the local Stargate, replicated to peer Stargates (per RF), journaled in the OpLog, and eventually flushed to the Extent Store. Reads are served from the local Stargate whenever possible (locality — about 95%+ of reads are local), and from a peer Stargate otherwise. The cluster's metadata (what blocks belong to what VM, where the replicas live, what's deduped/compressed) lives in a distributed ring called Cassandra (Medusa on larger clusters) — every CVM owns a slice of that ring.",
      },
      {
        heading: "The write path",
        body: "When a VM writes a block: (1) The hypervisor sends the write over iSCSI to the local CVM's Stargate. (2) Stargate writes the block to its SSD-resident OpLog (the write journal). (3) Stargate synchronously replicates the write to (RF-1) peer Stargates' OpLogs. (4) Only after all replicas are acknowledged does Stargate ack the write back to the hypervisor — guaranteeing durability. (5) A background process later coalesces, dedupes, compresses, and flushes the OpLog entries to the Extent Store (persistent storage on SSD and HDD). This is why writes have low latency (sub-millisecond for the ack) but the platform does heavy lifting in the background.",
        callout: {
          type: "info",
          text: "The synchronous replication means write latency = local OpLog write + network round-trip to peer OpLogs. This is why storage network latency matters — a slow storage network directly impacts VM write latency.",
        },
      },
      {
        heading: "The read path",
        body: "When a VM reads a block: (1) The hypervisor sends the read to the local CVM's Stargate. (2) Stargate checks its OpLog (recent writes) and the Extent Store (persistent data). (3) If the block is local, Stargate serves it directly — sub-millisecond latency. (4) If the block is only on a peer (because the VM migrated, or the local copy is being rebuilt), Stargate fetches it from the peer over the storage network — slightly higher latency. About 95%+ of reads are local in a steady-state cluster. If you see high read latency, check the storage network for saturation or check whether many VMs recently migrated.",
      },
      {
        heading: "Why DSF matters",
        body: "DSF is what makes Nutanix 'hyperconverged' — it's the software layer that turns N nodes with local disks into one shared, resilient, scalable storage pool. There's no separate storage array to fail, no SAN to design, no FC zoning. But the trade-off: the storage network is now mission-critical for every VM IO. A saturated or misconfigured storage network is the #1 cause of cluster-wide latency spikes — every VM depends on it. This is why we dedicated a whole module to networking fundamentals before getting here. DSF is brilliant, but it pushes a lot of responsibility onto your network design.",
      },
    ],
    keyTerms: [
      { term: "DSF", definition: "Distributed Storage Fabric — Nutanix's distributed storage stack running across all CVMs." },
      { term: "Stargate", definition: "The storage service process inside each CVM. Owns local disks, serves reads/writes, replicates." },
      { term: "OpLog", definition: "SSD-resident write journal. Absorbs synchronous writes, replicates them, then flushes to Extent Store." },
      { term: "Extent Store", definition: "Persistent log-structured store on SSD/HDD holding deduped, compressed, EC-X'd data." },
      { term: "Cassandra / Medusa", definition: "Distributed metadata ring storing fingerprints, replica locations, and cluster state." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "sto-01-ex-1",
        prompt: "What percentage of reads in a steady-state Nutanix cluster are served locally (from the local CVM)?",
        options: ["About 50%", "About 70%", "About 95%+", "100% (always local)"],
        correctIndex: 2,
        explanation: "About 95%+ of reads are served from the local Stargate. Remote reads happen when a VM migrated to a different host (its data is still on the old host) or during data rebuild. If you see high read latency, check for recent migrations or storage network saturation.",
      },
      {
        type: "fill-blank",
        id: "sto-01-ex-2",
        prompt: "The synchronous write replication means write latency = local OpLog write + network ___-trip to peer OpLogs.",
        acceptableAnswers: ["round", "round trip", "round-trip"],
        hint: "There and back again",
        explanation: "Write latency includes a network round-trip to peer CVMs (for RF replication). This is why storage network latency directly impacts VM write latency. Jumbo frames and a non-blocking switch help minimize this.",
      },
      {
        type: "diagram",
        id: "sto-01-ex-3",
        prompt: "Label the components of the DSF write path. Drag the labels to the correct slots.",
        slots: [
          { id: "slot-a", label: "Step 1: Hypervisor sends write to local CVM via", correctLabelId: "lab-iscsi", description: "The storage protocol" },
          { id: "slot-b", label: "Step 2: CVM writes to its SSD-resident", correctLabelId: "lab-oplog", description: "The write journal" },
          { id: "slot-c", label: "Step 3: Replicates to peer CVMs over the", correctLabelId: "lab-net", description: "What connects CVMs" },
          { id: "slot-d", label: "Step 4: Background flush to the persistent", correctLabelId: "lab-extent", description: "Where data lives long-term" },
        ],
        labels: [
          { id: "lab-iscsi", text: "iSCSI" },
          { id: "lab-oplog", text: "OpLog" },
          { id: "lab-net", text: "Storage Network" },
          { id: "lab-extent", text: "Extent Store" },
        ],
        explanation: "Write path: hypervisor → iSCSI → local CVM → OpLog (SSD journal) → replicate to peer OpLogs over storage network → ack → background flush to Extent Store.",
      },
    ],
  },

  {
    id: "sto-02",
    module: "storage",
    title: "Storage Pools, Containers, and EC-X",
    subtitle: "Carving up DSF into usable storage",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Storage pools — the raw layer",
        body: "A storage pool is the lowest layer of DSF abstraction. By default, each cluster has one storage pool per disk type: one for SSDs (Tier-0, the hot tier) and one for HDDs (Tier-1, the cold tier). All disks of that type from all nodes are added to the pool. You cannot create multiple storage pools of the same disk tier in modern AOS — the pool is essentially 'all the disks of this type in the cluster'. Adding a node adds its disks to the pool automatically. Storage pools are invisible to VMs — VMs live on storage containers, which are carved out of pools.",
      },
      {
        heading: "Storage containers — the policy layer",
        body: "A storage container is the user-facing storage object. Each container has its own RF (replication factor), dedup/compression/EC-X settings, encryption setting, and (optionally) an Active Directory-resident access-control policy. VM disks (vDisks) live inside a container; erasure coding and dedup/compression run at the container level. Modern AOS refers to these as 'Unified Storage Containers' because the same container can hold files, blocks, and objects — the protocol is determined by the service exposing it (Files, Volumes, Objects), not by the container itself. A typical cluster has 2-4 containers: e.g. 'Default-RF2', 'Mission-Critical-RF3', 'Archive-EC-X', 'Dev-Thin'.",
        callout: {
          type: "tip",
          text: "Design your containers around policy, not departments. One container per RF+data-reduction combo. Use AD policies or Prism Central projects for tenancy, not separate containers per team.",
        },
      },
      {
        heading: "Erasure Coding (EC-X) — capacity savings",
        body: "EC-X is Nutanix's erasure-coding implementation. It runs as a background Curator job: takes an RF2 or RF3 data set, stripes it across the cluster using a Reed-Solomon scheme, and replaces the RF replicas with parity stripes. Two common profiles: EC-X 4+2 (4 data + 2 parity, requires 6+ nodes) and EC-X 2+1 (2 data + 1 parity, requires 3+ nodes). The capacity savings: a 4+2 stripe consumes 1.5x raw vs RF2's 2x raw — a 25% saving. EC-X is best for cold/warm data (backup, archive, file shares) because reads incur stripe reconstruction overhead. It runs every ~90 minutes via Curator; only data that hasn't been recently modified is converted.",
      },
      {
        heading: "Choosing RF vs EC-X",
        body: "Use RF (RF2 or RF3) for hot data — OLTP databases, active VM workloads, anything with high IOPS. RF gives you the lowest latency because reads are direct (no stripe reconstruction). Use EC-X for cold/warm data — backups, archives, file shares, log archives. EC-X saves 25-50% raw capacity but adds latency on reads (reconstructing the stripe). Don't enable EC-X on a container with very high write rates — the conversion happens every 90 minutes, and freshly-written data sits at RF until then. Typical setup: 'Hot-Data' container with RF2/RF3, 'Archive' container with EC-X 4+2.",
      },
    ],
    keyTerms: [
      { term: "Storage Pool", definition: "Lowest DSF layer. One pool per disk tier per cluster (all SSDs in one, all HDDs in another)." },
      { term: "Storage Container", definition: "User-facing storage object. Carries RF, dedup/compression, EC-X, and AD policy. VM vDisks live here." },
      { term: "EC-X", definition: "Erasure Coding — Reed-Solomon parity stripes. 4+2 (6+ nodes) or 2+1 (3+ nodes). Saves 25-50% raw capacity." },
      { term: "Curator", definition: "Background MapReduce-style job runner. Handles EC-X conversion, dedup, tiering, space reclamation." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "sto-02-ex-1",
        prompt: "What is the capacity saving of EC-X 4+2 vs RF2?",
        options: [
          "EC-X 4+2 uses 50% less raw capacity",
          "EC-X 4+2 uses 25% less raw capacity (1.5x vs 2x)",
          "EC-X 4+2 uses the same raw capacity",
          "EC-X 4+2 uses 2x more raw capacity",
        ],
        correctIndex: 1,
        explanation: "RF2 = 2x raw (2 full copies). EC-X 4+2 = 1.5x raw (4 data + 2 parity per stripe). That's a 25% saving. EC-X 8+2 saves even more (1.25x raw) but needs 10+ nodes.",
      },
      {
        type: "mcq",
        id: "sto-02-ex-2",
        prompt: "Which workload should NOT use EC-X?",
        options: [
          "Backup target (write-once, read-rarely)",
          "OLTP database (high write IOPS, low latency required)",
          "Archive file share (cold data, infrequent reads)",
          "Log archive (write-heavy, read-rarely)",
        ],
        correctIndex: 1,
        explanation: "EC-X adds read latency (stripe reconstruction) and the conversion happens every 90 minutes (fresh writes sit at RF until then). For OLTP databases that need sub-ms latency on every read, stick with RF2 or RF3 — don't enable EC-X on that container.",
      },
      {
        type: "command-sim",
        id: "sto-02-ex-3",
        prompt: "From the CVM shell, list all storage containers in the cluster.",
        context: "CVM shell (nutanix@cvm$)",
        expectedCommands: ["ncli ctr list", "acli storage-container list"],
        hint: "Either ncli or acli works. Try 'ncli ctr list' (container list).",
        expectedOutput: `Storage Container Name   ID                                    Encrypted  Replication  FiB
Default-SF-1             4c0e2a3b-4c5d-6789-abcd-ef0123456789  false     2            false
Mission-Critical-RF3     8a1f2b3c-4d5e-6789-9abc-def012345678  false     3            false
Archive-EC-X             2b3c4d5e-6789-abcd-ef01-23456789abcd  false     2            false
Dev-Test                 3c4d5e6f-789a-bcde-f012-3456789abcde  false     2            false`,
        explanation: "ncli ctr list shows all storage containers with their RF (Replication column). 'Default-SF-1' is the default RF2 container; 'Mission-Critical-RF3' has RF3; the others are custom. You can also use 'acli storage-container list' — same info, different format.",
      },
    ],
  },

  // ─── MODULE 4: AHV NETWORKING ──────────────────
  {
    id: "ahv-01",
    module: "ahv-networking",
    title: "Open vSwitch (OVS) and AHV Bridges",
    subtitle: "The virtual switch inside every AHV host",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "OVS — the software switch",
        body: "AHV uses Open vSwitch (OVS) as its virtual switch. OVS is a production-grade, multilayer software switch — originally developed by Nicira (acquired by VMware), now Linux Foundation-hosted. If you've used VMware's VDS (Virtual Distributed Switch), OVS is the open-source equivalent: same concepts (port groups, VLAN tags, NIC teaming), different implementation. On AHV, every host runs a single OVS instance with one or more bridges. VM vNICs plug into bridges; bridges have one or more physical uplink ports. Configuration is exposed via Prism (the user-facing layer) but stored as OVSDB records that you can inspect with 'ovs-vsctl show' from the AHV shell.",
      },
      {
        heading: "Bridges — the connection layer",
        body: "An OVS bridge is the connection point between VM vNICs and physical uplinks. By default, AHV creates a bridge called 'br0' for VM traffic (sometimes named 'br0-up' for the bond underneath). Optionally, you can have 'br1' for a secondary network — common for separating storage traffic onto its own NICs in larger clusters. Each bridge has: (1) one or more physical uplinks (often as a bond for redundancy), (2) zero or more VM vNICs attached, (3) zero or more VLAN-tagged 'networks' (Prism objects representing port groups). When you create a VM network on VLAN 100, you're creating an OVS port-group equivalent: VM vNICs attached to that network get their traffic tagged with VLAN 100 on egress out the uplink.",
      },
      {
        heading: "The 'network' object in Prism",
        body: "In Prism, when you create an AHV 'network', you're creating a VLAN-tagged port group on top of a bridge. You specify: the bridge (usually br0), the VLAN ID (e.g. 100), and optionally IPAM settings (subnet, IP range, gateway) for the built-in DHCP server. The network object is then attached to VM vNICs. A vNIC attached to network 'VLAN-100-Mgmt' gets its traffic tagged with VLAN 100 when it egresses the physical uplink. This is identical to a Cisco switchport in access mode — the vNIC sees untagged traffic, the switch sees tagged traffic. Multiple network objects can share one bridge with different VLAN IDs.",
        callout: {
          type: "warning",
          text: "Don't manually edit OVS config with 'ovs-vsctl' on a running cluster — Prism will overwrite your changes on the next network reconfigure. Use Prism or acli for any persistent change.",
        },
      },
      {
        heading: "Bridging vs routing",
        body: "OVS bridges forward Layer 2 (Ethernet frames) only. They don't route between VLANs — that's a job for a real router or a Layer 3 switch upstream. If VM-A on VLAN 100 wants to talk to VM-B on VLAN 200, the traffic leaves AHV's uplink (tagged with VLAN 100), hits the physical switch, gets routed to VLAN 200, comes back to AHV (tagged with VLAN 200), and gets delivered to VM-B. AHV is just a switch port in this flow. The only exception is Flow Virtual Networking, which can do inter-VLAN routing inside the host — but that's covered in the Flow module. For basic AHV networking, think of OVS as a Layer 2 switch.",
      },
    ],
    keyTerms: [
      { term: "OVS", definition: "Open vSwitch — AHV's software switch. Open-source, multilayer, supports VLANs/LACP/QinQ/OpenFlow." },
      { term: "Bridge", definition: "OVS bridge object connecting VM vNICs to physical uplinks. Default is br0." },
      { term: "Network (Prism)", definition: "VLAN-tagged port group on top of a bridge. VM vNICs attach to networks." },
      { term: "br0-up", definition: "Common name for the bond under br0 — typically eth0+eth1 bonded." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "ahv-01-ex-1",
        prompt: "What virtual switch does AHV use?",
        options: ["VMware VDS", "Linux bridge only", "Open vSwitch (OVS)", "Cisco AVS"],
        correctIndex: 2,
        explanation: "AHV uses Open vSwitch (OVS) — an open-source, production-grade software switch. Same KVM/OVS toolchain you'd see on any Linux KVM host. Configurable from Prism or 'ovs-vsctl' from the AHV shell.",
      },
      {
        type: "fill-blank",
        id: "ahv-01-ex-2",
        prompt: "On a fresh AHV install, the default bridge name is ___ (with a bond called -up underneath).",
        acceptableAnswers: ["br0"],
        hint: "Two characters, starts with 'b'",
        explanation: "br0 is the default bridge. Under it, you'll typically find br0-up (the bond of physical NICs, e.g. eth0+eth1). You can verify with 'ovs-vsctl show' from the AHV shell.",
      },
      {
        type: "command-sim",
        id: "ahv-01-ex-3",
        prompt: "From the AHV host shell, show the OVS configuration (bridges, bonds, and uplinks).",
        context: "AHV host shell (root@ahv#)",
        expectedCommands: ["ovs-vsctl show", "ovs-vsctl show"],
        hint: "Use the OVS configuration tool. 'show' is the subcommand.",
        expectedOutput: `4c0e2a3b-4c5d-6789-abcd-ef0123456789
    Bridge "br0"
        Port "br0-up"
            Interface "eth0"
            Interface "eth1"
        Port "br0"
            Interface "br0"
                type: internal
    ovs_version: "2.13.90"`,
        explanation: "ovs-vsctl show displays the OVS configuration: bridge br0 with a bond br0-up containing two interfaces (eth0, eth1). The 'internal' interface br0 is the bridge's own IP. This is a healthy bond with two uplinks.",
      },
    ],
  },

  {
    id: "ahv-02",
    module: "ahv-networking",
    title: "VLAN Tagging and Bond Modes",
    subtitle: "Applying networking fundamentals to AHV",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Three VLAN tagging modes",
        body: "AHV supports three VLAN tagging modes on VM vNICs — exactly the same as Cisco switchport modes: (1) Access (default) — the vNIC is on a single VLAN; traffic is untagged on the wire (OVS adds the tag on ingress to the uplink). Used for normal VMs. (2) Trunk — the vNIC passes multiple VLANs; the VM is responsible for 802.1Q tagging (the guest OS must support VLAN tagging). Used for router/firewall VMs that need to receive multiple VLANs. (3) Native — same as trunk, but one specified VLAN is untagged on egress; used when the upstream switch expects the native VLAN to be untagged. VLAN tags are configured in the AHV 'network' object for Access mode, or directly on the vNIC for Trunk mode.",
      },
      {
        heading: "Access mode in detail",
        body: "When you create a VM vNIC in Access mode on VLAN 100: the VM sends untagged Ethernet frames into its vNIC. OVS receives them, adds an 802.1Q tag with VLAN 100, and sends them out the physical uplink. The physical switch receives tagged frames and routes them to wherever VLAN 100 goes. Return traffic arrives at the switch tagged with VLAN 100; the switch forwards it to the AHV uplink; OVS strips the tag and delivers the untagged frame to the VM. The VM never sees a VLAN tag — it thinks it's on a flat network. This is the default mode for 90% of VMs.",
      },
      {
        heading: "Trunk mode in detail",
        body: "Some VMs need to receive multiple VLANs — a virtual firewall (Palo Alto, Fortinet), a virtual router (pfSense, FRR), or a load balancer. These VMs need 802.1Q tagging end-to-end: the VM sends tagged frames, OVS passes them through unchanged, the switch sees the tags. To configure: set the vNIC to trunk mode with a list of allowed VLANs (or 0-4094 for all). The guest OS must have VLAN-aware interface configuration (Linux: vlan subinterfaces; Windows: Hyper-V virtual switch with VLANs). The upstream physical switchport must be a trunk port allowing those VLANs — a common failure mode is trunking the VM but leaving the switchport in access mode, which silently drops the tagged traffic.",
        callout: {
          type: "warning",
          text: "If you trunk a vNIC, the upstream physical switchport MUST be a trunk port with the matching VLAN set. Trunking the VM but leaving the switch in access mode = silent traffic drop.",
        },
      },
      {
        heading: "Bond modes — when to use which",
        body: "OVS bonds on AHV support three modes: (1) active-backup (default) — one NIC is active, others are standby; no switch configuration required; failover takes ~1-3 seconds. Simplest and most reliable; works with any switch topology including dual-switch. (2) balance-slb — source-MAC-based load balancing across all uplinks; no switch configuration required; VM MACs are distributed across the bond members. Better bandwidth than active-backup without switch complexity. (3) balance-tcp (LACP, 802.3ad) — true LACP aggregation; requires switch-side LACP configuration (Cisco: 'channel-group X mode active'); supports per-flow load balancing across uplinks. Best bandwidth, sub-second failover. Recommended mode for production if the switch supports LACP; otherwise active-backup is the safest choice.",
      },
    ],
    keyTerms: [
      { term: "Access Mode", definition: "vNIC on one VLAN; traffic untagged on wire. Default for normal VMs." },
      { term: "Trunk Mode", definition: "vNIC passes multiple VLANs; VM does 802.1Q tagging. Used for router/firewall VMs." },
      { term: "Native Mode", definition: "Trunk mode + one untagged VLAN (matches switchport trunk native)." },
      { term: "active-backup", definition: "Default AHV bond mode. One NIC active, others standby. No switch config. 1-3s failover." },
      { term: "balance-tcp (LACP)", definition: "802.3ad LACP bond. Requires switch LACP. Best bandwidth, sub-second failover." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "ahv-02-ex-1",
        prompt: "You create a VM vNIC with VLAN 100 in Access mode. What does the wire see when the VM sends a frame?",
        options: [
          "Untagged frames — OVS adds VLAN 100 tag on ingress to the uplink",
          "802.1Q-tagged frames with VLAN 100",
          "Frames with double tags (QinQ)",
          "No traffic egresses — access mode drops traffic",
        ],
        correctIndex: 0,
        explanation: "In Access mode, the vNIC sees untagged frames; OVS adds the VLAN tag on ingress to the physical uplink. This is identical to a Cisco switchport in access mode. The VM never sees a VLAN tag.",
      },
      {
        type: "mcq",
        id: "ahv-02-ex-2",
        prompt: "What is the default AHV bond mode?",
        options: ["LACP (balance-tcp)", "active-backup", "balance-slb", "round-robin"],
        correctIndex: 1,
        explanation: "active-backup is the default. One NIC active, others standby, no switch configuration required. Failover takes 1-3 seconds. LACP and balance-slb must be explicitly configured and require switch support.",
      },
      {
        type: "scenario",
        id: "ahv-02-ex-3",
        prompt: "You're configuring a Palo Alto firewall VM in AHV. The VM needs to receive traffic for 4 VLANs (10, 20, 30, 40) so it can route between them.",
        steps: [
          {
            id: "s1",
            text: "What VLAN tagging mode should the vNIC use?",
            options: [
              { id: "a", text: "Access mode on VLAN 10", correct: false, feedback: "Access mode only carries one VLAN. The firewall needs 4.", nextStepId: undefined },
              { id: "b", text: "Trunk mode allowing VLANs 10, 20, 30, 40", correct: true, feedback: "Correct! Trunk mode passes multiple VLANs; the VM (Palo Alto) handles 802.1Q tagging. The guest OS sees tagged frames and routes between them.", nextStepId: undefined },
              { id: "c", text: "Native mode with VLAN 10 untagged", correct: false, feedback: "Native mode is for when the upstream switch expects one VLAN untagged. A firewall usually wants all VLANs tagged for clarity.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "ahv-03",
    module: "ahv-networking",
    title: "Traffic Separation and Jumbo Frames",
    subtitle: "Designing the network for production",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Three traffic classes",
        body: "Nutanix clusters carry three logical traffic classes: (1) Management — CVM IP (192.168.5.x by default), hypervisor IP, Prism UI, SSH — typically a /24 or /27 VLAN. (2) Storage — CVM-to-CVM replication and iSCSI traffic; uses the 192.168.5.x range by default but should be on its own VLAN/subnet in production. (3) VM — user workload traffic, on whatever VLANs the VMs need. These three can share one bond (separated by VLANs — 'flat' pattern, common in small clusters) or be physically separated (mgmt+VM on one bond, storage on a dedicated pair of NICs — 'separated' pattern, common in larger clusters where storage bandwidth must not compete with VM bandwidth).",
      },
      {
        heading: "The storage network rule",
        body: "The Nutanix storage network should be: (1) RFC 1918 (private IP space — 10.x, 172.16-31.x, or 192.168.x). (2) No gateway (L2-only — CVMs only need to talk to each other, never beyond the local subnet). (3) Treated like an isolated SAN VLAN — no routing, no DHCP snooping dependencies, jumbo frames (MTU 9000) end-to-end. This is the same design philosophy as an iSCSI SAN network. The storage network carries every VM IO that involves replication or remote reads — saturating it is the #1 cause of cluster-wide latency spikes. Treat it with the same care as a production SAN.",
        callout: {
          type: "warning",
          text: "Never route the storage network. Routing it adds latency, complexity, and attack surface. CVMs communicate on L2 only — same subnet, no gateway, no router hop.",
        },
      },
      {
        heading: "Jumbo frames — the highest-impact tuning",
        body: "Jumbo frames (MTU 9000) on the Nutanix storage network is one of the highest-impact tuning knobs in the platform. CVMs replicate every write to peer CVMs over this network; with standard 1500-byte MTU, the TCP segment overhead and per-packet CPU cost caps throughput around 5-7 Gb/s on a 10 GbE link. With MTU 9000, the same link saturates at ~9.5 Gb/s. Jumbo frames must be enabled end-to-end: physical switch ports in the storage VLAN, the OVS bond on each AHV host, the CVM's internal storage interface, and the hypervisor's storage interface. A single 1500-byte hop silently degrades throughput — you'll see this in Prism → Analysis → 'CVM Network Throughput' as lower-than-expected bandwidth.",
      },
      {
        heading: "Verifying jumbo frames",
        body: "After configuring jumbo frames, verify with a ping test from one CVM to another using the 'do not fragment' flag: 'ping -M do -s 8972 <peer-cvm-ip>'. The -s 8972 is the largest payload that fits in a 9000-byte frame (9000 - 28 bytes of ICMP/IP headers = 8972). If the ping succeeds, jumbo is working end-to-end. If you get 'Frag needed and DF set' or the ping fails, there's a 1500-byte hop somewhere — usually a switch port you forgot to configure, or the CVM's bond interface. Always run this test after deployment and after any network change. A common gotcha: jumbo is on the switch but not on the CVM's bond — replication silently falls back to 1500 with no error.",
      },
    ],
    keyTerms: [
      { term: "Management Traffic", definition: "CVM IP, hypervisor IP, Prism UI, SSH. Usually a /24 or /27 VLAN." },
      { term: "Storage Traffic", definition: "CVM-to-CVM replication + iSCSI. L2-only, RFC 1918, no gateway, MTU 9000." },
      { term: "VM Traffic", definition: "User workload traffic. Whatever VLANs the VMs need." },
      { term: "Jumbo Frames", definition: "MTU 9000 end-to-end on storage network. Boosts 10 GbE throughput from ~6 to ~9.5 Gb/s." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "ahv-03-ex-1",
        prompt: "Why must jumbo frames (MTU 9000) be enabled end-to-end on the Nutanix storage network?",
        options: [
          "Because the CVM only supports MTU 9000",
          "A single 1500-byte hop silently halves throughput due to TCP fragmentation",
          "Because switch ports are required to be 9000 by spec",
          "Jumbo frames are optional and have no effect",
        ],
        correctIndex: 1,
        explanation: "Without jumbo end-to-end, the storage network tops out around 5-7 Gb/s on a 10 GbE link due to TCP segmentation overhead. With MTU 9000 everywhere, the same link saturates at ~9.5 Gb/s. A single 1500-byte hop causes silent fallback.",
      },
      {
        type: "mcq",
        id: "ahv-03-ex-2",
        prompt: "Which statement about the Nutanix storage network is correct?",
        options: [
          "It must be routable to the internet for replication",
          "It should be RFC 1918, no gateway, L2-only — like an isolated SAN VLAN",
          "It is the same as the management network by default",
          "It uses TCP port 22 only",
        ],
        correctIndex: 1,
        explanation: "Storage should be RFC 1918 (private), no gateway (L2-only), and treated like an isolated SAN VLAN. CVMs only need to talk to each other — same subnet, no routing. Routing it adds latency and attack surface.",
      },
      {
        type: "command-sim",
        id: "ahv-03-ex-3",
        prompt: "From a CVM, verify jumbo frames work end-to-end by pinging another CVM (192.168.5.11) with a 9000-byte payload, do-not-fragment flag.",
        context: "CVM shell (nutanix@cvm$)",
        expectedCommands: ["ping -M do -s 8972 192.168.5.11", "ping -M do -s 8972 192.168.5.11"],
        hint: "Linux ping: -M do (don't fragment), -s 8972 (payload size = 9000 - 28 headers)",
        expectedOutput: `PING 192.168.5.11 (192.168.5.11) 8972(9000) bytes of data.
8980 bytes from 192.168.5.11: icmp_seq=1 ttl=64 time=0.213 ms
8980 bytes from 192.168.5.11: icmp_seq=2 ttl=64 time=0.198 ms
8980 bytes from 192.168.5.11: icmp_seq=3 ttl=64 time=0.205 ms
^C
--- 192.168.5.11 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 0.198/0.205/0.213/0.006 ms`,
        explanation: "ping -M do -s 8972 sends a 9000-byte frame (8972 payload + 28 ICMP/IP headers). If it succeeds, jumbo is working end-to-end. If it fails with 'Frag needed and DF set', there's a 1500-byte hop somewhere — check switch ports, OVS bond, and CVM interface MTUs.",
      },
    ],
  },

  // ─── MODULE 5: PRISM ──────────────────
  {
    id: "prm-01",
    module: "prism",
    title: "Prism Element vs Prism Central",
    subtitle: "The two faces of Nutanix management",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Prism Element (PE) — per-cluster",
        body: "Prism Element is the per-cluster management interface. Every cluster, regardless of size, has exactly one PE. PE exposes the cluster's UI (https://<cluster-vip>:9440), REST API (v4 API current), and CLI (acli, ncli). Through PE you can: create/manage VMs, manage storage pools/containers, configure networking, view cluster health, run NCC (Nutanix Cluster Check), upgrade AOS, manage snapshots, and view performance analytics. PE is the unit of management for a single failure domain — if a cluster is down, its PE is down. PE IPs are typically VIP-backed (floating across CVMs) for HA; the VIP floats to a healthy CVM if the active one fails.",
      },
      {
        heading: "Prism Central (PC) — multi-cluster",
        body: "Prism Central is the multi-cluster, multi-site management plane. PC runs as a VM (or a 3-VM scale-out VM) and aggregates multiple PEs under a single pane of glass. Through PC you get: cross-cluster VM search and lifecycle, multi-cluster App-Security policies (Flow), Calm blueprint orchestration, Karbon Kubernetes cluster provisioning, centralized RBAC with SAML/AD, projects (multi-tenancy), categories for tag-based policy, and a unified REST API. PC is required for: Flow Network Security (micro-segmentation), Calm, Karbon, Files multi-cluster management, and Objects. PC does NOT replace PE — PE continues to own single-cluster operations; PC orchestrates across PEs.",
        callout: {
          type: "info",
          text: "Think of PE as a single switch's management IP, and PC as the network management system that talks to all your switches. Same split — single device vs fleet.",
        },
      },
      {
        heading: "When you need PC",
        body: "PC is required for: (1) Flow Network Security — micro-segmentation policies are managed centrally and pushed to PEs. (2) Calm — application blueprints deploy across hybrid clouds from PC. (3) Karbon (NKE) — Kubernetes clusters are provisioned from PC. (4) Files multi-cluster — file server management across clusters. (5) Objects — S3-compatible object storage. (6) Categories — global tag taxonomy for policy. (7) RBAC projects — multi-tenancy. If you only have one cluster and don't need Flow/Calm/Karbon, you can manage everything from PE alone. But once you have 2+ clusters or want advanced services, PC becomes essential.",
      },
      {
        heading: "PC sizing and operations",
        body: "PC is itself a workload — it's a VM (or set of VMs) that consumes cluster resources. Size the PC VM correctly: 16+ vCPU, 32+ GB RAM minimum for small; 3-VM scale-out for production (24+ vCPU, 96+ GB total). An undersized PC is the #1 cause of slow PC UI and failed PC upgrades. PC upgrades are separate from AOS upgrades — patch PC regularly, but expect ~30 min downtime per upgrade. Best practice: deploy PC on a dedicated cluster or on a stable production cluster with plenty of resources. PC is managed via its own UI (also at port 9440) and via REST API.",
      },
    ],
    keyTerms: [
      { term: "Prism Element (PE)", definition: "Per-cluster management interface. One PE per cluster. UI at https://<vip>:9440." },
      { term: "Prism Central (PC)", definition: "Multi-cluster management plane. Required for Flow, Calm, Karbon, Files multi-cluster, Objects." },
      { term: "acli", definition: "Acropolis Command Line Interface — runs on the CVM, manages VMs, networks, storage." },
      { term: "ncli", definition: "Nutanix CLI — alternative CLI for cluster-level operations (storage pools, snapshots, etc.)." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "prm-01-ex-1",
        prompt: "What is the difference between Prism Element and Prism Central?",
        options: [
          "PE is for storage; PC is for compute",
          "PE manages one cluster; PC manages many clusters as one platform",
          "PE is the CLI; PC is the GUI",
          "They are the same product with different names",
        ],
        correctIndex: 1,
        explanation: "Prism Element (PE) is per-cluster — every cluster has one. Prism Central (PC) aggregates multiple PEs under one pane. PC is required for Flow, Calm, Karbon, Files multi-cluster, and Objects.",
      },
      {
        type: "fill-blank",
        id: "prm-01-ex-2",
        prompt: "Prism Element's UI is reachable at https://<cluster-vip>:____.",
        acceptableAnswers: ["9440"],
        hint: "Four digits, starts with 9",
        explanation: "PE listens on port 9440 (HTTPS). PC also uses 9440. The URL is https://<cluster-vip>:9440. Port 443 is NOT used by Prism by default — you'd need a reverse proxy for that.",
      },
      {
        type: "mcq",
        id: "prm-01-ex-3",
        prompt: "Which of the following REQUIRES Prism Central to function?",
        options: [
          "Creating a VM on a single cluster",
          "Running NCC health checks",
          "Flow Network Security (micro-segmentation)",
          "Running acli commands on a CVM",
        ],
        correctIndex: 2,
        explanation: "Flow Network Security (micro-segmentation) requires PC — policies are managed centrally and pushed to PEs. Calm, Karbon, Files multi-cluster, and Objects also require PC. Single-cluster operations (VM creation, NCC, acli) work fine on PE alone.",
      },
    ],
  },

  {
    id: "prm-02",
    module: "prism",
    title: "Categories and RBAC",
    subtitle: "Tag-based policy and access control",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Categories — the universal tag system",
        body: "Categories are Nutanix's universal tag system. Every object (VM, host, cluster, image, network) can have one or more category values assigned, where each category has a name and value (e.g. App=Payroll, Tier=Gold, Env=Prod). Categories drive policy across the platform: Flow Network Security policies match on category pairs (e.g. 'App=Web can talk to App=App'); Calm blueprints can pin VMs to hosts with specific categories; RBAC projects can restrict by category; reporting and cost analysis group by category. Categories are required for Flow micro-segmentation — without categories, you cannot write a Flow policy. PC manages categories globally; PEs inherit them when registered.",
        callout: {
          type: "tip",
          text: "Design your category taxonomy up front. Renaming or restructuring categories after policies are built breaks the policies. Common taxonomy: App, Tier, Env, Owner, CostCenter.",
        },
      },
      {
        heading: "Designing a category taxonomy",
        body: "A typical enterprise category taxonomy: (1) App — which application does this VM belong to? Values: Payroll, CRM, Web, DB, etc. (2) Tier — what's the service tier? Values: Gold, Silver, Bronze. (3) Env — what environment? Values: Prod, Staging, Dev, Test. (4) Owner — which team owns it? Values: Finance, Engineering, Marketing. (5) CostCenter — for chargeback. Values: CC-1001, CC-1002. With this taxonomy, you can write Flow policies like 'Env=Prod AND App=Web can talk to Env=Prod AND App=Db on TCP 5432 only'. You can also report 'how much does the Engineering team's Dev environment cost?' by grouping on (Owner=Engineering, Env=Dev).",
      },
      {
        heading: "RBAC — who can do what",
        body: "Prism RBAC maps users/groups (from AD, SAML, or local) to roles at three scopes: (1) PC-wide — applies to everything PC sees. (2) Project — applies to a multi-tenant project (objects scoped to the project). (3) Category — applies to objects matching a category (rare). Built-in roles include: Cluster Admin (full cluster control), Operator (VM power ops + console), Viewer (read-only), Image Admin, Network Admin, Calm Developer, Self-Service User. Custom roles can be created with fine-grained permission lists. AD integration: PC reads group membership from AD/LDAP; SAML: PC consumes SAML assertions from IdP (Okta, ADFS, Azure AD).",
      },
      {
        heading: "Best practice: group-based roles",
        body: "Always assign roles to AD/SAML groups, not individual users. When employees join/leave, AD group membership changes — PC inherits the change on the next token refresh (~30 min). User-based assignments require manual cleanup and are a common audit finding. For example: create an AD group 'Nutanix-Cluster-Admins', add the senior admins to it, assign the Cluster Admin role to that group. When someone joins the team, the AD admin adds them to the group — PC access is automatic. When they leave, AD removal revokes PC access. This is the same pattern you'd use for any enterprise RBAC system (AWS IAM, Azure RBAC, etc.).",
        callout: {
          type: "warning",
          text: "AD group membership changes can take up to 30 min to reflect in PC (token refresh window). If you remove a user from an AD group, they may retain access for ~30 min.",
        },
      },
    ],
    keyTerms: [
      { term: "Category", definition: "Key/value tag (App=Payroll) attached to VMs/hosts/clusters. Drives Flow, Calm, RBAC, reporting." },
      { term: "RBAC", definition: "Role-Based Access Control. Maps users/groups to roles at PC-wide, Project, or Category scope." },
      { term: "Project", definition: "Multi-tenant scope in PC. Objects scoped to a project are only visible to project members." },
      { term: "Cluster Admin", definition: "Built-in role with full cluster control. Highest privilege." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "prm-02-ex-1",
        prompt: "Why are Categories required for Flow Network Security (micro-segmentation)?",
        options: [
          "Because Flow uses them as the source/dest selectors in policies",
          "Because Flow stores policies inside category objects",
          "Because Categories are the only RBAC scope",
          "Categories are not actually required for Flow",
        ],
        correctIndex: 0,
        explanation: "Flow policies match on category pairs (e.g. 'App=Web can talk to App=App on TCP 443'). Without categories on VMs, you cannot write a Flow policy. Categories are the universal tag system driving Flow, Calm, RBAC, and reporting.",
      },
      {
        type: "mcq",
        id: "prm-02-ex-2",
        prompt: "Which is a recommended best practice for Prism RBAC?",
        options: [
          "Assign roles directly to individual users",
          "Assign roles to AD/SAML groups, not individual users",
          "Use only the local 'admin' account for everything",
          "Disable RBAC entirely in production",
        ],
        correctIndex: 1,
        explanation: "Always assign roles to AD/SAML groups, not individual users. When employees join/leave, AD group membership changes — PC inherits the change on the next token refresh (~30 min). User-based assignments require manual cleanup.",
      },
      {
        type: "scenario",
        id: "prm-02-ex-3",
        prompt: "You're designing a category taxonomy for a customer. They want to: (a) write Flow policies that say 'web VMs can talk to app VMs', (b) charge back costs by department, (c) distinguish prod from dev.",
        steps: [
          {
            id: "s1",
            text: "What's the minimum set of categories you'd create?",
            options: [
              { id: "a", text: "Just one: App=Web", correct: false, feedback: "One category isn't enough — you need to also distinguish environment (prod/dev) and department for chargeback.", nextStepId: undefined },
              { id: "b", text: "App (Web/App/Db), Env (Prod/Dev), Owner (department)", correct: true, feedback: "Correct! Three categories cover all three needs: App for Flow policies, Env for prod/dev separation, Owner for chargeback. This is a standard minimal taxonomy.", nextStepId: undefined },
              { id: "c", text: "Just one: VM-Name", correct: false, feedback: "VM names are not categories and don't drive policy. Use structured categories like App/Env/Owner.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  // ─── MODULE 6: FLOW ──────────────────
  {
    id: "flw-01",
    module: "flow",
    title: "Flow — Network Virtualization Overview",
    subtitle: "Nutanix's SDN stack and how it extends networking",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "What Flow is",
        body: "Flow is the umbrella brand for Nutanix's software-defined networking (SDN). It has three sub-products: (1) Flow Virtual Networking (FVN) — software-defined VPCs with subnets, floating IPs, NAT, routing — overlays L2/L3 across AHV clusters without touching the underlay. (2) Flow Network Security (FNS) — micro-segmentation policies that filter east-west traffic between VMs based on categories (e.g. 'App=Web cannot talk to App=Db'). (3) Flow Virtual DNS — a DNS service that resolves names inside VPCs. Flow is enabled from PC; it requires PC and AHV (Flow Virtual Networking is not supported on ESXi/Hyper-V, but FNS supports all hypervisors).",
      },
      {
        heading: "Flow Virtual Networking — overlays",
        body: "Flow Virtual Networking (FVN) is the overlay network layer. A Flow VPC is a software-defined network that overlays the physical network — think AWS VPC or Azure VNet, but running on Nutanix. Inside a VPC, you define subnets (e.g. 10.0.1.0/24, 10.0.2.0/24) and the platform routes between them. A VPC can span multiple AHV clusters, so VMs in cluster A and cluster B can be in the same L2 subnet without stretching a VLAN — the underlay just carries the encapsulated (GENEVE) traffic. Each VPC has a virtual router that handles: inter-subnet routing, NAT (SNAT for egress, DNAT via floating IP for ingress), and optionally an external subnet (a transit network to your physical routers).",
      },
      {
        heading: "Flow Network Security — micro-segmentation",
        body: "Flow Network Security (FNS) is the micro-segmentation layer. Policies are written as: source category, destination category, allowed protocols/ports, action (allow/deny/reject). For example: 'App=Web can talk to App=App on TCP 443' and 'App=App can talk to App=Db on TCP 5432'. The policy is enforced inside the hypervisor (in the OVS data path) on every packet — no appliance required. Default policy is 'allow all' (segmented by cluster, isolated by VLAN) until you explicitly apply an 'isolation' policy. FNS supports: hit counts (per-rule traffic stats), policy hits (logged to PC), and 'quarantine' mode (one-click isolate a compromised VM). FNS is comparable to NSX Distributed Firewall or Cisco ACI contracts — same east-west filtering model.",
        callout: {
          type: "tip",
          text: "Start with 'monitor' mode (log all hits, no enforcement) for 1-2 weeks before switching to 'enforce' mode. This catches missing policies before they break production.",
        },
      },
      {
        heading: "Flow Virtual DNS",
        body: "Flow Virtual DNS provides DNS resolution inside VPCs. VMs in a VPC can resolve each other by name (e.g. 'web-01.vpc1.local') without needing an external DNS server. This is useful for application stacks that scale up/down — new VMs automatically get DNS entries, and removed VMs have theirs cleaned up. Flow Virtual DNS is integrated with FVN and configured per-VPC. For external names (like google.com), Flow Virtual DNS forwards to your enterprise DNS resolvers. This service is one of the reasons Flow VPCs feel like a self-contained cloud environment — they have their own DNS, routing, NAT, and firewall, all software-defined.",
      },
    ],
    keyTerms: [
      { term: "Flow", definition: "Umbrella brand for Nutanix SDN: Virtual Networking (VPCs), Network Security (micro-seg), Virtual DNS." },
      { term: "FVN", definition: "Flow Virtual Networking — software-defined VPCs overlaying the physical network using GENEVE." },
      { term: "FNS", definition: "Flow Network Security — micro-segmentation policies enforced in the hypervisor based on categories." },
      { term: "GENEVE", definition: "Generic Network Virtualization Encapsulation (RFC 8926). UDP/6081. Used by FVN for overlay traffic." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "flw-01-ex-1",
        prompt: "What are the three sub-products of Flow?",
        options: [
          "Virtual Networking, Network Security, Virtual DNS",
          "Compute, Storage, Network",
          "Prism Element, Prism Central, Calm",
          "Files, Volumes, Objects",
        ],
        correctIndex: 0,
        explanation: "Flow = Virtual Networking (VPCs, subnets, floating IPs) + Network Security (micro-segmentation) + Virtual DNS (in-VPC name resolution). All three are managed from Prism Central.",
      },
      {
        type: "mcq",
        id: "flw-01-ex-2",
        prompt: "Where are Flow Network Security policies enforced?",
        options: [
          "On a dedicated firewall appliance",
          "On the upstream physical switch",
          "Inside the hypervisor (OVS data path) on every host",
          "On the CVM",
        ],
        correctIndex: 2,
        explanation: "FNS is enforced inside the hypervisor (in the OVS data path on AHV). No appliance required — every packet between VMs is inspected locally on the host. This is the same model as NSX Distributed Firewall or Cisco ACI contracts.",
      },
      {
        type: "fill-blank",
        id: "flw-01-ex-3",
        prompt: "Flow Virtual Networking uses the ___ encapsulation protocol (RFC 8926, UDP/6081) to overlay VPC traffic.",
        acceptableAnswers: ["GENEVE", "geneve"],
        hint: "Successor to VXLAN, supports variable-length TLV options",
        explanation: "GENEVE (Generic Network Virtualization Encapsulation, RFC 8926) is the encapsulation protocol Flow uses. It's the successor to VXLAN — same overlay model, slightly different protocol with more metadata support. UDP port 6081.",
      },
    ],
  },

  {
    id: "flw-02",
    module: "flow",
    title: "Flow VPCs, Floating IPs, and NAT",
    subtitle: "Putting it all together — overlays in practice",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Anatomy of a Flow VPC",
        body: "A Flow VPC is a software-defined network overlaying your physical underlay. Inside a VPC, you define subnets (e.g. 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24) and the platform routes between them automatically. A VPC can span multiple AHV clusters, so VMs in cluster A and cluster B can be in the same L2 subnet without stretching a VLAN — the underlay just carries the GENEVE-encapsulated traffic. Each VPC has an external subnet (a real VLAN on your physical network) that acts as the transit to upstream routers. VPCs use overlapping IP spaces (RFC 1918) by design — multiple VPCs can each use 10.0.0.0/16 without conflict, because each VPC is isolated.",
      },
      {
        heading: "SNAT — outbound from VPC",
        body: "Every VPC has SNAT (Source NAT) enabled by default on its external subnet. When a VM in a VPC initiates a connection to an external destination (e.g. an internet IP), the VPC's virtual router rewrites the source IP from the VM's private IP (e.g. 10.0.1.5) to the router's external IP (a real IP on the underlay VLAN). Return traffic is reverse-NAT'd back to the VM's private IP. This means all VMs in a VPC egress via one router IP — like Cisco PAT (overload). The benefit: VMs don't need individual routable IPs to reach external networks; they all share the router's external IP.",
      },
      {
        heading: "Floating IPs — inbound to VMs",
        body: "For inbound traffic (external clients reaching a VM in a VPC), you use a Floating IP. A floating IP is an external IP that DNATs to a VM's private VPC IP. The floating IP lives in the VPC's external subnet (a real, routed VLAN). When traffic arrives at the floating IP, FVN rewrites the destination to the VM's private IP and forwards it. The key benefit vs traditional DNAT: the floating IP is bound to the VM, not to the host. If the VM live-migrates to another host, the floating IP follows it — no ARP gymnastics, no switch reconfiguration. Floating IPs are typically used for external-facing services (web servers, load balancers) and for keeping a stable IP when a VM fails over.",
        callout: {
          type: "info",
          text: "Floating IPs are a finite resource — limited by your external subnet size. Don't assign one to every VM; reserve for external-facing services only.",
        },
      },
      {
        heading: "GENEVE overlay in action",
        body: "When VM-A in VPC1 (on host 1) sends a frame to VM-B in the same VPC (on host 2), FVN wraps the original L2/L3 frame in a GENEVE header (which includes a 24-bit VNI — Virtual Network Identifier) and sends it over UDP/6081 to host 2. The receiving host unwraps GENEVE, reads the VNI, and delivers the original frame to VM-B. The underlay only needs: IP reachability between AHV hosts, UDP 6081 allowed, and (strongly recommended) jumbo frames — GENEVE adds ~50 bytes overhead, so a 1500-byte underlay forces VM MTU to 1450. A 9000-byte underlay keeps VM MTU at 1500. If VMs are silently dropping large packets, check the underlay MTU — this is a common Flow deployment issue.",
      },
    ],
    keyTerms: [
      { term: "VPC", definition: "Virtual Private Cloud — software-defined overlay network with its own subnets, routing, NAT. Spans AHV clusters." },
      { term: "Floating IP", definition: "External IP DNAT'd to a VM's private VPC IP. Bound to the VM, survives live migration." },
      { term: "SNAT", definition: "Source NAT — rewrites source IP. VPC egress: all VMs share the router's external IP (PAT-style)." },
      { term: "VNI", definition: "24-bit Virtual Network Identifier in GENEVE header. Identifies which VPC a packet belongs to." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "flw-02-ex-1",
        prompt: "What is a Flow Floating IP?",
        options: [
          "An IP that dynamically moves between VMs based on load",
          "An external IP that DNATs to a VM's private VPC IP — bound to the VM, survives live migration",
          "The IP of the Flow virtual router",
          "The DHCP-leased IP for the VM",
        ],
        correctIndex: 1,
        explanation: "A floating IP is an external IP DNAT'd to the VM's private VPC IP. The unique feature vs traditional DNAT: it follows the VM across hosts during live migration — no ARP gymnastics, no switch reconfiguration.",
      },
      {
        type: "mcq",
        id: "flw-02-ex-2",
        prompt: "What does SNAT on a VPC external subnet provide?",
        options: [
          "Per-VM external IP for inbound traffic",
          "Egress for all VMs in the VPC via one router IP (PAT-style)",
          "DNS resolution for the VPC",
          "Encryption for east-west traffic",
        ],
        correctIndex: 1,
        explanation: "SNAT (enabled by default on VPC external subnets) rewrites source IPs so all VMs in the VPC egress via one router IP — like Cisco PAT. Inbound uses floating IPs (per-VM DNAT).",
      },
      {
        type: "scenario",
        id: "flw-02-ex-3",
        prompt: "You've deployed a Flow VPC. Users report that file transfers between VMs in the VPC work for small files but fail for large files (over ~1450 bytes). What's the likely cause?",
        steps: [
          {
            id: "s1",
            text: "What's the most likely root cause?",
            options: [
              { id: "a", text: "VPC subnets are misconfigured", correct: false, feedback: "If subnets were misconfigured, no traffic would work. The fact that small files work rules this out.", nextStepId: undefined },
              { id: "b", text: "Underlay MTU is 1500 — GENEVE overhead (~50 bytes) clamps effective VM MTU to 1450", correct: true, feedback: "Correct! GENEVE adds ~50 bytes overhead. With a 1500-byte underlay, VM MTU is effectively 1450. Large packets get silently dropped. Fix: enable jumbo frames (MTU 9000) on the underlay end-to-end, OR set VM MTU to 1450.", nextStepId: undefined },
              { id: "c", text: "Flow Network Security is blocking large packets", correct: false, feedback: "FNS doesn't filter by packet size — it filters by source/dest category and port. This is an MTU issue.", nextStepId: undefined },
            ],
          },
        ],
      },
    ],
  },

  // ─── MODULE 7: DATA SERVICES ──────────────────
  {
    id: "dat-01",
    module: "data-services",
    title: "Files, Volumes, and Objects",
    subtitle: "Three ways to expose DSF storage",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Why three services",
        body: "DSF (the underlying distributed storage fabric) is great, but applications need different protocols: file servers want SMB/NFS, databases want iSCSI block, modern apps want S3-compatible object. Nutanix could have exposed all three through one interface, but each protocol has different semantics — so they created three first-class services, each optimized for its protocol. All three sit on top of DSF (so they share the same disks, RF, dedup, compression, EC-X). The difference is how they present storage to clients and what features they expose.",
      },
      {
        heading: "Nutanix Files — SMB and NFS",
        body: "Nutanix Files (formerly AFS) is the platform's native file service. It runs as one or more 'Files VMs' on the cluster; each Files VM is a Linux-based SMB/NFS server that exposes DSF-backed storage as file shares. Files supports: SMB 2/3 (with continuous availability for transparent failover), NFS v3/v4.1, Kerberos, AD integration, snapshots, replication (Async DR), file-level restores, dedup, compression, antivirus integration (ICAP), and quota management. A typical deployment: one Files VM per cluster per protocol (SMB and NFS can co-exist), with shares carved out and presented to users. Files replaces both Windows File Server clusters and traditional NAS filers (NetApp, EMC Isilon) for general-purpose workloads. Files requires Prism Central for management.",
      },
      {
        heading: "Nutanix Volumes — iSCSI block",
        body: "Nutanix Volumes (formerly ABS — Acropolis Block Service) exposes DSF-backed storage as iSCSI LUNs to external hosts (physical servers, bare-metal DBs, hyper-V clusters that need shared storage). Each volume is presented as an iSCSI target; the external host connects via standard iSCSI (MPIO recommended). Volumes supports: per-volume QoS (limit IOps), multi-attach (for shared-disk clusters like WSFC), snapshots, async DR, replication, and inline dedup/compression. Typical use cases: physical SQL Server needing shared block storage, Hyper-V cluster shared volumes, bare-metal Oracle RAC. Volumes does NOT require Prism Central — managed via PE — but can be aggregated in PC.",
        callout: {
          type: "warning",
          text: "Always use MPIO (Multipath I/O) with at least two paths (to two different CVM IPs) for Volumes HA. A single iSCSI session means CVM failure = host IO failure.",
        },
      },
      {
        heading: "Nutanix Objects — S3-compatible",
        body: "Nutanix Objects is the platform's S3-compatible object store. It runs as a set of 'Objects VMs' on the cluster and exposes an S3 API (REST) endpoint. Objects supports: S3 API compatibility (most S3 clients work unmodified — aws-cli, boto3, s3cmd), buckets, lifecycle policies, versioning, encryption at rest (KMS-managed keys), WORM (write-once-read-many) for compliance, replication across clusters, and tiering to AWS S3 / Azure Blob. Use cases: backup target (Veeam, Commvault), log archive, ML data lake, application media storage. Objects requires Prism Central for management. S3 clients use AWS SDK, boto3, aws-cli — just point them at the Objects endpoint URL with appropriate access/secret keys.",
      },
    ],
    keyTerms: [
      { term: "Nutanix Files", definition: "NAS service — SMB 2/3 + NFS v3/v4.1. Runs as Files VMs. Managed via PC." },
      { term: "Nutanix Volumes (ABS)", definition: "Block service — iSCSI LUNs to external hosts. Per-volume QoS. Managed via PE." },
      { term: "Nutanix Objects", definition: "S3-compatible object store. Buckets, versioning, lifecycle. Managed via PC." },
      { term: "MPIO", definition: "Multipath I/O — multiple iSCSI paths for HA. Required for Volumes in production." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "dat-01-ex-1",
        prompt: "Which Nutanix data service provides S3-compatible object storage?",
        options: ["Nutanix Files", "Nutanix Volumes", "Nutanix Objects", "Nutanix Era"],
        correctIndex: 2,
        explanation: "Nutanix Objects exposes an S3 API endpoint. Works with aws-cli, boto3, s3cmd — point clients at the Objects URL with access/secret keys.",
      },
      {
        type: "mcq",
        id: "dat-01-ex-2",
        prompt: "Which Nutanix data service would you use to give a physical SQL Server shared block storage?",
        options: ["Nutanix Files", "Nutanix Volumes (ABS)", "Nutanix Objects", "Nutanix Era"],
        correctIndex: 1,
        explanation: "Volumes (ABS) exposes DSF-backed storage as iSCSI LUNs to external hosts. Physical SQL Server with MPIO is a canonical Volumes use case. Always use MPIO with at least two paths.",
      },
      {
        type: "fill-blank",
        id: "dat-01-ex-3",
        prompt: "Nutanix Files serves both SMB and ___ protocols to clients.",
        acceptableAnswers: ["NFS", "nfs"],
        hint: "Network File System, common on Linux",
        explanation: "Files serves SMB 2/3 (Windows, with continuous availability) and NFS v3/v4.1 (Linux/Unix). It replaces both Windows File Server clusters and traditional NAS filers for general-purpose workloads.",
      },
    ],
  },

  // ─── MODULE 8: OPERATIONS ──────────────────
  {
    id: "ops-01",
    module: "operations",
    title: "Calm, Move, and Karbon",
    subtitle: "Automation, migration, and Kubernetes",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Nutanix Calm — application orchestration",
        body: "Calm is Nutanix's application orchestration platform. A Calm blueprint is a YAML/JSON document that defines a multi-VM application: VM specs (CPU/RAM/disk), network attachments, install scripts (Bash/PowerShell/Ansible), Day-2 actions (scale-out, scale-in, custom runbooks), and policies (who can deploy, quota). Blueprints can deploy to: AHV on-prem, AWS, Azure, VMware (via Calm for VMware), and Google Cloud. Calm integrates with PC categories for policy, and with Era for DB provisioning. Common use cases: 3-tier app provisioning (web + app + db in one blueprint), Nginx HA cluster deployment, repeatable dev environment provisioning, scaling stateless web tiers up/down on schedule.",
      },
      {
        heading: "Nutanix Move — VM migration",
        body: "Nutanix Move (formerly Xtract) is the platform's migration tool. Move runs as a VM (the Move VM) and orchestrates migrations from source hypervisors (VMware ESXi, Hyper-V, AWS EC2, Azure VM, AWS/Azure to AHV/ESXi on Nutanix) to target Nutanix clusters. Move supports: bulk migration (many VMs in parallel), delta sync (initial copy then incremental sync until cutover), change VM format (VMDK → QCOW2), network remapping (VDS port group → AHV network), and post-migration script execution (e.g. install Nutanix Guest Tools). Move handles the source-side quiescing (VMware snapshot for VDDK-based read) and the target-side import. Use cases: VMware-to-AHV migration, AWS repatriation, Hyper-V consolidation.",
        callout: {
          type: "tip",
          text: "Always do a test migration on a non-critical VM first. Network remapping is the #1 issue — if your AHV network mapping is wrong, the migrated VM comes up with no network.",
        },
      },
      {
        heading: "Nutanix Karbon — managed Kubernetes",
        body: "Nutanix Karbon (now part of 'Nutanix Kubernetes Engine' / NKE) is the platform's managed Kubernetes service. From Prism Central, you click 'Provision Kubernetes Cluster', specify node counts (master + workers), and NKE provisions the VMs, the K8s control plane, the CNI (Cilium by default), the CSI (Nutanix CSI for persistent volumes), and the registry integration. NKE handles: cluster lifecycle (upgrade K8s version), node auto-repair, snapshot/DR, and access (kubeconfig download). NKE uses kubeadm under the hood; clusters are CNCF-conformant. Use cases: on-prem container platform (replacing OpenShift/Rancher), CI/CD ephemeral clusters, ML workloads with GPU nodes. NKE is licensed separately; clusters consume AHV resources like any other VM workload.",
      },
      {
        heading: "How they fit together",
        body: "Calm, Move, and Karbon are complementary: Move migrates existing VMs onto Nutanix; Calm orchestrates new multi-VM app deployments (which can include NKE clusters); Karbon provisions and operates Kubernetes specifically. A typical journey: use Move to migrate legacy VMware VMs to AHV; use Calm to automate the deployment of new 3-tier apps; use Karbon to provide a Kubernetes platform for containerized workloads. All three are managed from Prism Central and integrate with PC categories for policy. Era (Database-as-a-Service) extends this further by automating DB lifecycle — covered in advanced materials but worth knowing exists.",
      },
    ],
    keyTerms: [
      { term: "Calm", definition: "Application orchestration — blueprints define multi-VM apps with Day-2 actions. Deploys to AHV, AWS, Azure, VMware, GCP." },
      { term: "Move", definition: "VM migration tool. Migrates from ESXi, Hyper-V, AWS, Azure to Nutanix AHV. Delta sync for minimal-downtime cutover." },
      { term: "Karbon / NKE", definition: "Managed Kubernetes on AHV. One-click provisioning, Cilium CNI, Nutanix CSI. CNCF-conformant." },
      { term: "Blueprint", definition: "Calm's YAML/JSON definition of a multi-VM app: specs, networks, scripts, Day-2 actions." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "ops-01-ex-1",
        prompt: "Which Nutanix tool is used to migrate VMs from VMware ESXi to AHV?",
        options: ["Nutanix Calm", "Nutanix Move", "Nutanix Karbon", "Nutanix Era"],
        correctIndex: 1,
        explanation: "Move migrates VMs from source hypervisors (ESXi, Hyper-V, AWS, Azure) to Nutanix AHV. Supports bulk migration, delta sync, VMDK→QCOW2 format conversion, and network remapping.",
      },
      {
        type: "mcq",
        id: "ops-01-ex-2",
        prompt: "What does Nutanix Calm primarily orchestrate?",
        options: [
          "Storage replication",
          "Multi-VM application blueprints with Day-2 actions across on-prem and cloud",
          "AOS upgrades",
          "Network micro-segmentation policies",
        ],
        correctIndex: 1,
        explanation: "Calm is application orchestration: blueprints define multi-VM apps (specs, networks, install scripts, Day-2 actions like scale-out/in and runbooks). Blueprints can deploy to AHV, AWS, Azure, VMware, GCP.",
      },
      {
        type: "mcq",
        id: "ops-01-ex-3",
        prompt: "What CNI does Nutanix Kubernetes Engine (NKE) use by default?",
        options: ["Flannel", "Calico", "Cilium", "Weave Net"],
        correctIndex: 2,
        explanation: "NKE uses Cilium as the default CNI — eBPF-based networking and security. Nutanix CSI is used for persistent volumes, kubeadm under the hood, CNCF-conformant.",
      },
    ],
  },

  // ─── MODULE 9: HYBRID CLOUD ──────────────────
  {
    id: "hyb-01",
    module: "hybrid-cloud",
    title: "NC2 and Hybrid Cloud",
    subtitle: "Running Nutanix outside your datacenter",
    duration: "12 min",
    xp: 10,
    theory: [
      {
        heading: "Why hybrid cloud",
        body: "Most enterprises don't want everything in one datacenter. Some workloads stay on-prem for compliance, latency, or cost reasons; others burst to cloud for elasticity or DR. The challenge: managing two different platforms (on-prem Nutanix + AWS/Azure) means two operational teams, two skill sets, two sets of policies. NC2 (Nutanix Cloud Clusters) solves this by running Nutanix software on AWS and Azure bare-metal — same AOS, same Prism, same Flow, same Calm. Your team manages both with the same tools, and workloads can move freely between on-prem and cloud.",
      },
      {
        heading: "What NC2 is",
        body: "NC2 deploys Nutanix software on bare-metal instances inside AWS and Azure. The cloud provider supplies the hardware (AWS: Metal instances; Azure: dedicated hosts); Nutanix supplies AOS, AHV, and management. From the user's perspective, an NC2 cluster is just another Nutanix cluster — same Prism UI, same acli, same Flow, same Calm. NC2 enables: burst-to-cloud (run steady-state on-prem, burst to cloud for peak), cloud migration (move workloads to cloud without re-platforming), and cloud-native Nutanix services (run Files/Objects/Era in cloud). NC2 clusters can be managed by the same PC as on-prem clusters — one operational plane across hybrid.",
      },
      {
        heading: "NC2 networking model",
        body: "NC2 networking has two layers: (1) Underlay — AWS/Azure native SDN. NC2 clusters are deployed into a VPC/VNet; each NC2 node gets a primary ENI on a cloud-native subnet. CVM-to-CVM replication uses the cloud underlay. (2) Overlay — Flow Virtual Networking (FVN) runs on top, providing VPCs, subnets, and floating IPs to VMs just like on-prem. For connecting NC2 to on-prem: VPN or Direct Connect/Azure ExpressRoute to the cloud VNet, then VNet peering or transit gateway to extend on-prem L3 to NC2. Flow overlay can span on-prem + NC2 clusters, so a VM in a VPC on-prem and a VM in the same VPC on NC2 are in the same L2 — useful for live migration across the hybrid boundary.",
        callout: {
          type: "warning",
          text: "AWS/Azure native network ACLs and security groups apply to NC2 underlay traffic. If you block UDP 6081 in a security group, FVN GENEVE overlay traffic between NC2 and on-prem will fail.",
        },
      },
      {
        heading: "Xi Cloud and management",
        body: "Xi Cloud is Nutanix's hosted cloud platform — Nutanix owns the hardware in regional datacenters; you consume it as a service. Xi Cloud services include: Xi Leap (DR-as-a-service), Xi Frame (Desktop-as-a-Service), and Xi Bits (object storage). Xi Cloud is multi-tenant — you get a dedicated PC instance, but the underlying hardware is shared with other tenants (with Nutanix-managed isolation). Once you register your on-prem clusters, NC2 clusters, and Xi Cloud clusters under one PC, they all appear in the 'Clusters' tab — same UI, same RBAC, same categories. You can: search across all clusters, deploy Calm blueprints across hybrid, apply Flow policies across hybrid, run reports across hybrid. The key benefit: one operational plane across hybrid.",
      },
    ],
    keyTerms: [
      { term: "NC2", definition: "Nutanix Cloud Clusters — Nutanix software on AWS/Azure bare-metal. Same AOS, Prism, Flow as on-prem." },
      { term: "Xi Cloud", definition: "Nutanix-hosted cloud. Multi-tenant. Services: Xi Leap (DR), Xi Frame (DaaS), Xi Bits (objects)." },
      { term: "Underlay (NC2)", definition: "AWS/Azure native SDN. NC2 nodes get primary ENIs on cloud subnets. CVM replication uses this." },
      { term: "Direct Connect / ExpressRoute", definition: "AWS / Azure dedicated private link to on-prem. Used for hybrid NC2 connectivity." },
    ],
    exercises: [
      {
        type: "mcq",
        id: "hyb-01-ex-1",
        prompt: "What is NC2?",
        options: [
          "Nutanix's CLI tool",
          "Nutanix software running on AWS / Azure bare-metal — same AOS, same Prism",
          "A network protocol used between CVMs",
          "Nutanix's Kubernetes engine",
        ],
        correctIndex: 1,
        explanation: "NC2 (Nutanix Cloud Clusters) deploys Nutanix software on AWS bare-metal / Azure dedicated hosts. Same AOS, AHV, Prism, Flow, Calm as on-prem. Can be managed by the same PC across hybrid.",
      },
      {
        type: "mcq",
        id: "hyb-01-ex-2",
        prompt: "If you block UDP 6081 in an AWS security group attached to NC2, what breaks?",
        options: [
          "Nothing — security groups don't affect Nutanix",
          "iSCSI traffic between CVMs",
          "GENEVE overlay traffic for Flow VPCs between NC2 and on-prem",
          "Prism UI access",
        ],
        correctIndex: 2,
        explanation: "AWS/Azure security groups apply to NC2 underlay traffic. UDP 6081 is GENEVE — blocking it breaks Flow overlay traffic between NC2 and on-prem clusters in the same VPC.",
      },
      {
        type: "fill-blank",
        id: "hyb-01-ex-3",
        prompt: "Nutanix Cloud Clusters on AWS use AWS ___ instances (bare-metal) for the Nutanix nodes.",
        acceptableAnswers: ["Metal", "metal", "Bare Metal", "bare metal"],
        hint: "AWS instances that give you the actual physical server",
        explanation: "NC2 on AWS uses AWS Metal instances (physical servers, not virtualized). On Azure, it uses Azure dedicated hosts. This gives Nutanix direct hardware access for PCIe passthrough to the CVM — same as on-prem appliances.",
      },
    ],
  },
];

// Helper: get all lesson IDs in order
export const allLessonIds: string[] = lessons.map((l) => l.id);

// Helper: lessons by module
export function lessonsByModule(moduleId: ModuleId): Lesson[] {
  return lessons.filter((l) => l.module === moduleId);
}

// Helper: get next lesson ID (or null if last)
export function getNextLessonId(lessonId: string): string | null {
  const idx = allLessonIds.indexOf(lessonId);
  if (idx < 0 || idx >= allLessonIds.length - 1) return null;
  return allLessonIds[idx + 1];
}

// Helper: get previous lesson ID (or null if first)
export function getPrevLessonId(lessonId: string): string | null {
  const idx = allLessonIds.indexOf(lessonId);
  if (idx <= 0) return null;
  return allLessonIds[idx - 1];
}

// Helper: get lesson by ID
export function lessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
