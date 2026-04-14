export interface LocationStructure {
    [country: string]: {
        callingCode: string;
        provinces: {
            [province: string]: {
                districts: {
                    [district: string]: {
                        sectors: string[];
                    }
                }
            }
        }
    }
}

export const locations: LocationStructure = {
    "Rwanda": {
        "callingCode": "+250",
        "provinces": {
            "Kigali City": {
                "districts": {
                    "Nyarugenge": { "sectors": ["Nyarugenge", "Muhima", "Nyamirambo", "Mageragere", "Kanyinya", "Kigali", "Rwezamenyo"] },
                    "Gasabo": { "sectors": ["Kacyiru", "Remera", "Kimironko", "Gisozi", "Jabana", "Jali", "Kinyinya", "Nduba", "Ndera", "Rusororo", "Rutunga", "Bumbogo", "Gatsata", "Gikomero"] },
                    "Kicukiro": { "sectors": ["Kicukiro", "Kanombe", "Gahanga", "Gatenga", "Gikondo", "Kagarama", "Masaka", "Niboye", "Nyarugunga"] }
                }
            },
            "Southern Province": {
                "districts": {
                    "Huye": { "sectors": ["Ngoma", "Tumba", "Mukura", "Mbazi", "Gishamvu", "Huye", "Karama", "Kinazi", "Maraba", "Rusatira", "Rwaniro", "Simbi"] },
                    "Nyanza": { "sectors": ["Busasamana", "Mukingo", "Muyira", "Ntyazo", "Nyagisozi", "Busoro", "Cyabakamyi", "Kibirizi", "Kigoma", "Rwabicuma"] },
                    "Gisagara": { "sectors": ["Gikonko", "Gishubi", "Kansi", "Kibilizi", "Kigembe", "Mamba", "Mugeranza", "Mukindo", "Musha", "Ndora", "Nyanza", "Save"] },
                    "Kamonyi": { "sectors": ["Gacurabwenge", "Karama", "Kayenzi", "Kayumbu", "Mugina", "Musambira", "Ngamba", "Nyamiyaga", "Nyarubaka", "Rugalika", "Rukoma", "Runda"] },
                    "Muhanga": { "sectors": ["Cyeza", "Kabacuzi", "Kibangu", "Kiyumba", "Muhanga", "Mushishiro", "Nyabinoni", "Nyamabuye", "Nyakariro", "Rongi", "Shyogwe"] },
                    "Nyamagabe": { "sectors": ["Buruhukiro", "Cyanika", "Gatare", "Kaduha", "Kamegeli", "Kibirizi", "Kibumbwe", "Kitabi", "Mbazi", "Mugano", "Musange", "Musebeya", "Mushubi", "Nkomane", "Gasaka", "Tare", "Uwinkingi"] },
                    "Nyaruguru": { "sectors": ["Cyahinda", "Busanze", "Kibeho", "Mata", "Muganza", "Munini", "Ngera", "Ngoma", "Nyabimata", "Nyagisozi", "Ruheru", "Ruramba", "Rusenge"] },
                    "Ruhango": { "sectors": ["Bweramana", "Byimana", "Kabagari", "Kinazi", "Mbuye", "Mwendo", "Ntongwe", "Ruhango", "Shingiro"] }
                }
            },
            "Northern Province": {
                "districts": {
                    "Musanze": { "sectors": ["Muhoza", "Kinigi", "Gacaca", "Gashaki", "Gataraga", "Kimonyi", "Musanze", "Nkotsi", "Nyange", "Rwaza", "Shingiro", "Cyuve"] },
                    "Burera": { "sectors": ["Bungwe", "Butaro", "Cyanika", "Cyeru", "Gahunga", "Gatebe", "Gitovu", "Kagogo", "Kinoni", "Kinyababa", "Kivuye", "Nemba", "Rugarama", "Rugendabari", "Ruhunde", "Rusarabuye", "Rwerere"] },
                    "Gakenke": { "sectors": ["Busengo", "Coko", "Cyabingo", "Gakenke", "Gashenyi", "Janja", "Kamubuga", "Karambo", "Kivuruga", "Mataba", "Minazi", "Mugunga", "Muhondo", "Muyongwe", "Muzo", "Nemba", "Ruli", "Rusasa", "Rushashi"] },
                    "Gicumbi": { "sectors": ["Bukure", "Bwisige", "Byumba", "Cyumba", "Giti", "Kaniga", "Manyagiro", "Miyove", "Kageyo", "Mukarange", "Muko", "Mutete", "Nyamiyaga", "Nyankenke", "Rubaya", "Rukomo", "Rushaki", "Rutare", "Ruvune", "Rwambogo", "Shangasha"] },
                    "Rulindo": { "sectors": ["Base", "Burega", "Bushoki", "Buyoga", "Cyinzuzi", "Cyungo", "Kinihira", "Kisaro", "Masoro", "Mbogo", "Murambi", "Ngoma", "Ntarabana", "Rukozo", "Rusiga", "Shyorongi", "Tumba"] }
                }
            },
            "Eastern Province": {
                "districts": {
                    "Bugesera": { "sectors": ["Gashora", "Juru", "Kamabuye", "Ntarama", "Mareba", "Mayange", "Musenyi", "Mwogo", "Ngeruka", "Nyamata", "Nyarugenge", "Rahuha", "Rweru", "Shyara", "Rilima"] },
                    "Gatsibo": { "sectors": ["Gasange", "Gatsibo", "Gitoki", "Kabatwa", "Kageyo", "Kiramuruzi", "Kiziguro", "Muhura", "Murambi", "Ngarama", "Nyagihanga", "Remera", "Rugarama", "Rwimbogo"] },
                    "Kayonza": { "sectors": ["Gahini", "Kabare", "Kabarondo", "Mukarange", "Murama", "Murundi", "Mwiri", "Ndego", "Nyamirama", "Rukara", "Ruramira", "Rwinkwavu"] },
                    "Kirehe": { "sectors": ["Gahara", "Gatore", "Kigarama", "Kigina", "Kirehe", "Mahama", "Mpanga", "Musaza", "Mushikiri", "Nasho", "Nyamugari", "Nyarubuye"] },
                    "Ngoma": { "sectors": ["Gashanda", "Jarama", "Karembo", "Kazo", "Kibungo", "Mugesera", "Murama", "Mutenderi", "Remera", "Rukira", "Rukumberi", "Rurenge", "Sake", "Zaza"] },
                    "Nyagatare": { "sectors": ["Gatunda", "Karama", "Karangazi", "Katabagemu", "Matimba", "Mimuri", "Mukama", "Musheri", "Nyagatare", "Rukomo", "Rwempasha", "Rwimiyaga", "Tabagwe"] },
                    "Rwamagana": { "sectors": ["Fumbwe", "Gahengeri", "Gishari", "Karenge", "Kigabiro", "Muhazi", "Munyaga", "Munyiginya", "Musha", "Muyumbu", "Mwulire", "Nyakariro", "Nzige", "Rubona"] }
                }
            },
            "Western Province": {
                "districts": {
                    "Karongi": { "sectors": ["Bwishyura", "Gashari", "Gishyita", "Gisovu", "Mubuga", "Murambi", "Murundi", "Mutuntu", "Rubengera", "Rugabano", "Ruganda", "Rwankuba", "Twumba"] },
                    "Ngororero": { "sectors": ["Bwira", "Gatumba", "Hindiro", "Kabaya", "Kageyo", "Kavumu", "Matyazo", "Muhanda", "Muhororo", "Ndaro", "Ngororero", "Nyange", "Sovu"] },
                    "Nyabihu": { "sectors": ["Bigogwe", "Jenda", "Jomba", "Kabatwa", "Karago", "Kintobo", "Mukamira", "Muringa", "Rambura", "Rugera", "Rurembo", "Shyira"] },
                    "Nyamasheke": { "sectors": ["Bushekeri", "Busubutere", "Cyato", "Gihombo", "Kagano", "Kanjongo", "Karambi", "Karengera", "Kirimbi", "Macuba", "Mahembe", "Nyabitekeri", "Rangiro", "Shangi", "Tyazo"] },
                    "Rubavu": { "sectors": ["Bugeshi", "Busasamana", "Cyanzarwe", "Gisenyi", "Kanama", "Kanzenze", "Mudende", "Nyakiriba", "Nyamyumba", "Nyundo", "Rubavu", "Rugerero"] },
                    "Rusizi": { "sectors": ["Butare", "Bugarama", "Bweyeye", "Gashonga", "Giheke", "Gihundwe", "Gikundamvura", "Gitambi", "Kamembe", "Muganza", "Mururu", "Nkanka", "Nkombo", "Nkungu", "Nyakabuye", "Nyakarenzo", "Nzahaha", "Rwimbogo"] },
                    "Rutsiro": { "sectors": ["Boneza", "Gihango", "Kigeyo", "Kivumu", "Manihira", "Mukura", "Murunda", "Musasa", "Mushubati", "Mushonyi", "Nyabirasi", "Ruhango", "Rusebeya"] }
                }
            }
        }
    },
    "Kenya": {
        "callingCode": "+254",
        "provinces": {
            "Nairobi": {
                "districts": {
                    "Westlands": { "sectors": ["Kitisuru", "Parklands", "Highridge", "Kangemi"] },
                    "Dagoretti": { "sectors": ["Kawangware", "Riruta", "Uthiru", "Mutu-ini"] }
                }
            },
            "Mombasa": {
                "districts": {
                    "Mvita": { "sectors": ["Old Town", "Majengo", "Ganjoni"] },
                    "Nyali": { "sectors": ["Kongowea", "Kadzandani", "Mkomani"] }
                }
            }
        }
    },
    "Uganda": {
        "callingCode": "+256",
        "provinces": {
            "Central Region": {
                "districts": {
                    "Kampala": { "sectors": ["Central", "Kawempe", "Makindye", "Nakawa", "Rubaga"] },
                    "Entebbe": { "sectors": ["Division A", "Division B"] }
                }
            }
        }
    },
    "Tanzania": {
        "callingCode": "+255",
        "provinces": {
            "Dar es Salaam": {
                "districts": {
                    "Ilala": { "sectors": ["Kariakoo", "Buguruni", "Gerezani"] },
                    "Kinondoni": { "sectors": ["Magomeni", "Kijitonyama", "Mikocheni"] }
                }
            }
        }
    },
    "USA": {
        "callingCode": "+1",
        "provinces": {
            "California": {
                "districts": {
                    "Los Angeles County": { "sectors": ["Los Angeles", "Santa Monica", "Beverly Hills", "Pasadena"] },
                    "San Francisco": { "sectors": ["Downtown", "Mission District", "SoMa", "Richmond"] }
                }
            },
            "New York": {
                "districts": {
                    "New York City": { "sectors": ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"] }
                }
            }
        }
    },
    "United Arab Emirates": {
        "callingCode": "+971",
        "provinces": {
            "Dubai": {
                "districts": {
                    "Dubai City": { "sectors": ["Downtown Dubai", "Dubai Marina", "Business Bay", "Palm Jumeirah", "JLT", "Al Barsha"] }
                }
            },
            "Abu Dhabi": {
                "districts": {
                    "Abu Dhabi City": { "sectors": ["Al Reem Island", "Yas Island", "Corniche", "Khalifa City"] }
                }
            }
        }
    }
};
