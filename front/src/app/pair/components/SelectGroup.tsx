import { SelectedGroup } from "@/types/pair";

export const SelectGroup = ({ 
  handleSelectedGroup 
} : {
  handleSelectedGroup: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}) => {

  return (
    <div>
      <select 
        onChange={handleSelectedGroup}
        className="
          p-2
          border
          border-yellow-300 
          rounded-md shadow-sm 
          focus:outline-none 
          focus:ring-2 
          focus:ring-yellow-300 
          focus:border-yellow-300 
      ">
        <option value={SelectedGroup.all}>
          {SelectedGroup.all}
        </option>
        <option value={SelectedGroup.request}>
          {SelectedGroup.request}
        </option>
        <option value={SelectedGroup.approved}>
          {SelectedGroup.approved}
        </option>
        <option value={SelectedGroup.rejected}>
          {SelectedGroup.rejected}
        </option>
      </select>
    </div>
  );
}
