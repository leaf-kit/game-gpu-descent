// 탐험 가능한 GPU 프로파일. 수치 출처: docs/research/01_gpu_architecture.md (NVIDIA 화이트페이퍼, Chips and Cheese, Luo et al.)
export const GPUS = [
  {
    id: 'h100', name: 'NVIDIA H100 SXM5', arch: { ko: 'Hopper (GH100)', en: 'Hopper (GH100)' }, process: 'TSMC 4N', transistors: '80 B', transistorsKo: '800억', dieMm2: '814 mm²',
    sms: 132, smsFull: 144, gpcs: 8, tpcsPerGpc: 9, tpcs: 66, cudaCores: '16,896', tensorCores: 528, l2: '50 MB (2 partitions)', memory: '80 GB HBM3', memBw: '3.35 TB/s',
    hbmStacks: 5, hbmSites: 6, memType: 'HBM3', dieEdgeMm: 28.5, packageMm: 57, boardMm: 150, tdp: '700 W', clockGHz: 1.98, nvlink: '900 GB/s', formFactor: 'SXM5',
    l1kb: 256, regKb: 256, fp32PerBlock: 32, int32PerBlock: 16, fp64PerBlock: 16, maxWarps: 64, tcFma: 512,
    lat: { shared: 29, l1: 33, l2near: 264, l2far: 502, hbm: 479 },
    blurb: { ko: '2022년 AI 붐의 주역. 다이 하나에 800억 트랜지스터, HBM3 5스택. 데이터센터용이라 디스플레이 출력이 없다.', en: 'The workhorse of the 2022 AI boom. 80 B transistors on one die, 5 HBM3 stacks. Data-center only: no display output.' },
  },
  {
    id: 'b200', name: 'NVIDIA B200', arch: { ko: 'Blackwell (2-die)', en: 'Blackwell (2-die)' }, process: 'TSMC 4NP', transistors: '208 B (104 B × 2)', transistorsKo: '2,080억(다이당 1,040억)', dieMm2: '≈1,600 mm² (2 dies)',
    sms: 148, smsFull: 160, gpcs: 8, tpcsPerGpc: 10, tpcs: 74, cudaCores: '18,944 (est.)', tensorCores: 592, l2: '126 MB (measured)', memory: '192 GB HBM3e (180 GB datasheet)', memBw: '8 TB/s',
    hbmStacks: 8, hbmSites: 8, memType: 'HBM3e', dieEdgeMm: 28.5, packageMm: 80, boardMm: 160, tdp: '1,000 W', clockGHz: 1.95, nvlink: '1.8 TB/s', formFactor: 'SXM', twoDie: true,
    l1kb: 256, regKb: 256, fp32PerBlock: 32, int32PerBlock: 16, fp64PerBlock: 16, maxWarps: 64, tcFma: 1024, tmem: 256,
    lat: { shared: 29, l1: 39, l2near: 290, l2far: 400, hbm: 600 },
    blurb: { ko: '레티클 한계 다이 두 개를 10 TB/s NV-HBI로 붙여 하나의 GPU로. HBM3e 8스택, 5세대 텐서 코어(FP4), 텐서 전용 메모리 TMEM.', en: 'Two reticle-limit dies joined by a 10 TB/s NV-HBI into one GPU. 8 HBM3e stacks, 5th-gen Tensor Cores (FP4), dedicated Tensor Memory.' },
  },
  {
    id: 'rtx4090', name: 'NVIDIA GeForce RTX 4090', arch: { ko: 'Ada Lovelace (AD102)', en: 'Ada Lovelace (AD102)' }, process: 'TSMC 4N', transistors: '76.3 B', transistorsKo: '763억', dieMm2: '608.5 mm²',
    sms: 128, smsFull: 144, gpcs: 11, tpcsPerGpc: 6, tpcs: 64, cudaCores: '16,384', tensorCores: 512, l2: '72 MB', memory: '24 GB GDDR6X', memBw: '1,008 GB/s',
    hbmStacks: 0, hbmSites: 0, memType: 'GDDR6X', gddrChips: 12, dieEdgeMm: 24.7, packageMm: 45, boardMm: 304, tdp: '450 W', clockGHz: 2.52, nvlink: 'none', formFactor: 'PCIe', graphics: true,
    l1kb: 128, regKb: 256, fp32PerBlock: 32, int32PerBlock: 16, fp64PerBlock: 0.5, maxWarps: 48, tcFma: 128, rtCores: 128, rops: 176,
    lat: { shared: 30, l1: 43, l2near: 273, l2far: 285, hbm: 541 },
    blurb: { ko: '게이머의 GPU. 래스터 엔진·RT 코어·NVENC를 갖춘 완전한 그래픽 칩. 메모리는 패키지 밖 PCB 위 GDDR6X 12개.', en: 'The gamer\'s GPU: a complete graphics chip with raster engines, RT Cores and NVENC. Memory is 12 GDDR6X chips on the PCB, outside the package.' },
  },
];
