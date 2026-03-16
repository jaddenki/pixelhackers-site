export interface RevealConfig {
  duration:     number;
  easing:       string;
  sweepSpeed:   number;
  sweepSpread:  number;
  sweepOffset:  number;
  maxBlockSize: number;
  minBlockSize: number;
  jitterAmount: number;
  jitterBase:   number;
  jitterFPS:    number;
}

export const CONFIG: RevealConfig = {
  duration:      2900,
  easing:        'easeOutCubic',
  sweepSpeed:    2,
  sweepSpread:   0.4,
  sweepOffset:   0.1,
  maxBlockSize:  10,
  minBlockSize:  1,
  jitterAmount:  0.006,
  jitterBase:    0,
  jitterFPS:     1,
};
