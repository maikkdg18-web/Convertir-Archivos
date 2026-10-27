interface ProgressProps {
  label: string;
  /** 0–100. Sin valor, la barra se muestra indeterminada. */
  value?: number;
}

export function Progress({ label, value }: ProgressProps) {
  const isIndeterminate = value === undefined;

  return (
    <div className="progress-wrap" role="status">
      <p className="progress-label">{label}</p>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : Math.round(value)}
      >
        <div
          className="progress-fill"
          data-indeterminate={isIndeterminate}
          style={isIndeterminate ? undefined : { width: `${value}%` }}
        />
      </div>
    </div>
  );
}
