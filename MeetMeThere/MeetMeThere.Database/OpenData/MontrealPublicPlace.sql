CREATE TABLE [dbo].[MontrealPublicPlace]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [no] INT NULL DEFAULT null, 
    [lieux_en_activites_ou_construction] VARCHAR(MAX) NULL, 
    [arrondissement] VARCHAR(MAX) NULL, 
    [noms_du_reseau] VARCHAR(MAX) NULL, 
    [nom_du_lieu_culturel_municipal] VARCHAR(MAX) NULL, 
    [adresse] VARCHAR(MAX) NULL, 
    [public string code_postal { get; set; }] VARCHAR(MAX) NULL, 
    [ville] VARCHAR(MAX) NULL, 
    [province] VARCHAR(MAX) NULL, 
    [telephone_general] VARCHAR(MAX) NULL, 
    [telephone_secteur_adulte] VARCHAR(MAX) NULL, 
    [telephone_secteur_jeunesse] VARCHAR(MAX) NULL, 
    [public string site_internet { get; set; }] VARCHAR(MAX) NULL, 
    [transport] VARCHAR(MAX) NULL, 
    [latitude] FLOAT NULL, 
    [longitude] FLOAT NULL
)
