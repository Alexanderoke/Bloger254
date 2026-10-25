

export function formData(iso){
  return new Date(iso).toLocaleDateString(undifined,{
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}