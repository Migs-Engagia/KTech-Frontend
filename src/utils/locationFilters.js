export const getProvinceCities = (province, provinceCities = {}) => {
  if (!province || province === "All") {
    const allCities = Object.values(provinceCities).flat();
    return [...new Set(allCities)].sort((left, right) =>
      left.localeCompare(right)
    );
  }

  return [...(provinceCities[province] || [])];
};

export const isCityValidForProvince = (province, city, provinceCities = {}) => {
  if (!city || city === "All") {
    return true;
  }

  return getProvinceCities(province, provinceCities).includes(city);
};
