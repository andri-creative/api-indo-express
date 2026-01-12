import fs from "fs";
import path from "path";

const readCSV = (filename: string) => {
  const filePath = path.join(__dirname, "..", "data", filename);
  const data = fs.readFileSync(filePath, "utf-8");

  const lines = data.split("\n").slice(1);
  return lines.filter(Boolean).map((line) => {
    const [code, parent_code, name] = line.split(",");
    return { code, parent_code, name };
  });
};

export const getProvinces = () => readCSV("Province.csv");

export const getRegenciesByProvince = (provinceCode: string) =>
  readCSV("Regency.csv").filter((item) => item.parent_code === provinceCode);

export const getDistrictsByRegency = (regencyCode: string) =>
  readCSV("District.csv").filter((item) => item.parent_code === regencyCode);

export const getVillagesByDistrict = (districtCode: string) =>
  readCSV("Village.csv").filter((item) => item.parent_code === districtCode);
