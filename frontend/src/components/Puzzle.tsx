import { SVGProps } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import { StyledComponentProps, ClassKeyOfStyles } from '@material-ui/styles';

export interface PuzzleState {
  givenDigits?: {
    row: number;
    column: number;
    digit: number;
  }[];

  enteredDigits?: {
    row: number;
    column: number;
    digit: number;
  }[];

  centrePencils?: {
    row: number;
    column: number;
    digits: number[];
  }[];

  cornerPencils?: {
    row: number;
    column: number;
    digits: number[];
  }[];
};

const styles = (theme: Theme) => createStyles({
  root: {
    backgroundColor: 'white',
  },

  rect: {
    fill: 'none',
    stroke: 'black',
    pointerEvents: 'none',
  },

  outerRect: {
    strokeWidth: 3,
  },

  cellRect: {
    strokeWidth: 0.5,
    pointerEvents: 'fill',

    '&:hover': {
      fill: 'yellow',
      fillOpacity: 0.25,
    },
  },

  boxRect: {
    strokeWidth: 1.5,
  },

  digit: {
    ...theme.typography.body1,
    pointerEvents: 'none',
    textAnchor: 'middle',
  },

  givenDigit: {
    fontSize: 14,
  },

  enteredDigit: {
    fill: 'blue',
    fontSize: 14,
  },

  centrePencilDigit: {
    fontSize: 6,
    fill: 'blue',
  },

  centrePencilDigitCondensed: {
    fontSize: 4,
  },

  cornerPencilDigit: {
    fontSize: 4,
    fill: 'blue',
  },
});

const useStyles = makeStyles(styles);

export interface PuzzleProps extends StyledComponentProps<ClassKeyOfStyles<typeof styles>> {
  puzzleState?: PuzzleState;
  svgProps?: SVGProps<SVGSVGElement>;
};

export const Puzzle = (props: PuzzleProps) => {
  const { puzzleState = {}, svgProps = {} } = props;
  const classes = useStyles(props);
  const cellSize = 20;
  const textShift = '0.35em';

  const cornerPencilAnchors = [
    { x: (1/6) * cellSize, y: (1/6) * cellSize },
    { x: (3/6) * cellSize, y: (1/6) * cellSize },
    { x: (5/6) * cellSize, y: (1/6) * cellSize },
    { x: (1/6) * cellSize, y: (3/6) * cellSize },
    { x: (5/6) * cellSize, y: (3/6) * cellSize },
    { x: (1/6) * cellSize, y: (5/6) * cellSize },
    { x: (3/6) * cellSize, y: (5/6) * cellSize },
    { x: (5/6) * cellSize, y: (5/6) * cellSize },
  ];

  const {
    givenDigits = [], enteredDigits = [], centrePencils = [], cornerPencils = []
  } = puzzleState;

  return (
    <svg className={classes.root} viewBox={[0, 0, 9*cellSize, 9*cellSize].join(' ')} {...svgProps}>
      {
        (new Array(9)).fill(null).map((_, row) => (
          <>
          {
            (new Array(9)).fill(null).map((_, col) => (
              <rect
                key={`cell-${row}-${col}`} className={`${classes.rect} ${classes.cellRect}`}
                x={col*cellSize} y={row*cellSize}
                width={cellSize} height={cellSize}
              />
            ))
          }
          </>
        ))
      }
      {
        givenDigits.map(({ row, column, digit }) => (
          <text
            key={`given-${row}-${column}`} className={`${classes.digit} ${classes.givenDigit}`}
            x={(0.5+column)*cellSize} y={(0.5+row)*cellSize} dy={textShift}
          >{
            digit
          }</text>
        ))
      }
      {
        enteredDigits.map(({ row, column, digit }) => (
          <text
            key={`entered-${row}-${column}`} className={`${classes.digit} ${classes.enteredDigit}`}
            x={(0.5+column)*cellSize} y={(0.5+row)*cellSize} dy={textShift}
          >{
            digit
          }</text>
        ))
      }
      {
        cornerPencils.map(({ row, column, digits }) => (
          digits.map((digit, index) => {
            const {x, y} = cornerPencilAnchors[index % cornerPencilAnchors.length];
            return (
              <text
                key={`cornerPencil-${row}-${column}-${digit}`}
                className={`${classes.digit} ${classes.cornerPencilDigit}`}
                x={column*cellSize + x} y={row*cellSize + y} dy={textShift}
              >{
                digit
              }</text>
            );
          })
        ))
      }
      {
        centrePencils.map(({ row, column, digits }) => (
          <text
            key={`centrePencil-${row}-${column}`}
            className={`${classes.digit} ${classes.centrePencilDigit} ${digits.length >= 6 ? classes.centrePencilDigitCondensed : ''}`}
            x={(0.5+column)*cellSize} y={(0.5+row)*cellSize} dy={textShift}
          >{
            digits.join('')
          }</text>
        ))
      }
      <rect
        className={`${classes.rect} ${classes.outerRect}`}
        x={0} y={0} width={9*cellSize} height={9*cellSize}
      />
      {
        (new Array(3)).fill(null).map((_, row) => (
          <>
          {
            (new Array(3)).fill(null).map((_, col) => (
              <rect
                key={`box-${row}-${col}`} className={`${classes.rect} ${classes.boxRect}`}
                x={col*cellSize*3} y={row*cellSize*3}
                width={cellSize*3} height={cellSize*3}
              />
            ))
          }
          </>
        ))
      }
    </svg>
  );
};

export default Puzzle;
