import React from 'react';
import numbro from 'numbro';

export const FormatNumber = ({ number }: { number: number }) => {
  return (
    <span>{numbro(number).format({ thousandSeparated: true })}</span>
  );
}; 