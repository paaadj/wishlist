import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";

interface IFilter {
  columnFilters: {
    id: string;
    value: string;
  }[];
  setColumnFilters: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        value: string;
      }[]
    >
  >;
}

function Filter(props: IFilter) {
  const { columnFilters, setColumnFilters } = props;
  const usernameFilterText =
    columnFilters.find((item) => item.id === "username")?.value || "";
  const onFilterChange = (id: string, value: string) => setColumnFilters(
    prev => prev.filter(f => f.id !== id).concat({id, value})
  );
  return (
    <Box>
      <InputGroup size="md" maxW="20rem" margin={3}>
        <InputRightElement pointerEvents="none">
          <Icon as={LuFilter} />
        </InputRightElement>
        <Input
          type="text"
          variant="filled"
          placeholder="Username"
          borderRadius={3}
          value={usernameFilterText}
          onChange={(e) => onFilterChange("username", e.target.value)}
        />
      </InputGroup>
    </Box>
  );
}

export default Filter;
