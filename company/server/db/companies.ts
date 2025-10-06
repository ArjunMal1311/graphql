export function getSampleCompanies() {
  return [
    {
      id: "1",
      name: "TechCorp",
      description: "A leading technology company specializing in AI and cloud solutions."
    },
    {
      id: "2",
      name: "GreenFoods",
      description: "Organic food production and delivery company."
    },
    {
      id: "3",
      name: "FinBank",
      description: "A modern fintech startup offering digital banking solutions."
    },
    {
      id: "4",
      name: "EduSmart",
      description: "Education platform providing online courses and learning resources.",
      employees: [
        {
          id: "127818",
          name: "arjun",
          outlook: "atg@atg.com"
        }
      ]
    }
  ];
}


export function getSingleCompany() {
  return (
    {
      id: "4",
      name: "EduSmart",
      description: "Education platform providing online courses and learning resources.",
      employees: [
        {
          id: "127818",
          name: "arjun",
          outlook: "atg@atg.com"
        }
      ]
    }
  )
}

export function GetSampleEmployee() {
  return (
    {
      id: "127818",
      name: "arjun",
      outlook: "atg@atg.com"
    }
  )
}