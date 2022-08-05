import { DateRange } from "react-date-range";
import locale from 'date-fns/locale/pt';
import React from "react";



export default function PeriodPicker(props) {


  let { editableDateInputs, onChange, moveRangeOnFirstSelection, ranges } = props;

  return (
    <DateRange
      locale={locale}
      editableDateInputs={editableDateInputs}
      onChange={onChange}
      moveRangeOnFirstSelection={moveRangeOnFirstSelection}
      ranges={ranges}

    />
  )

}