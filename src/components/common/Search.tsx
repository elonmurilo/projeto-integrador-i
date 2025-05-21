import React from "react";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export const Search: React.FC<SearchProps> = ({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="d-flex gap-2 mt-2 mt-sm-0">
      <input
        type="text"
        placeholder="🔍 Procurar"
        className="form-control"
        value={searchTerm}
        onChange={handleSearch}
        style={{ maxWidth: "200px" }}
      />
      <select
        className="form-select"
        value={sortOrder}
        onChange={handleSortOrderChange}
        style={{ maxWidth: "150px" }}
      >
        <option value="recentes">Recentes</option>
        <option value="antigos">Antigos</option>
        <option value="nome_asc">Nome A-Z</option>
      </select>
    </div>
  );
};
