CREATE TABLE [dbo].[Meeting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Name] VARCHAR(MAX) NULL DEFAULT null, 
    [NeedWifi] BIT NULL DEFAULT 0, 
    [NeedElectricity] BIT NULL DEFAULT 0, 
    [StartDateTime] DATETIME NULL, 
    [EndDateTime] DATETIME NULL, 
    [Types] INT NULL DEFAULT null, 
    [LocationName] VARCHAR(MAX) NULL, 
    [Address] VARCHAR(MAX) NULL
)
