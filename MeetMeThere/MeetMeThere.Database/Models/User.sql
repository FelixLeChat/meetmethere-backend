CREATE TABLE [dbo].[User]
(
    [Id] INT NOT NULL PRIMARY KEY,
    [Email] VARCHAR(MAX) NULL DEFAULT null, 
	[Username] VARCHAR(MAX) NULL DEFAULT null,
    [HashPassword] VARCHAR(MAX) NULL DEFAULT null, 
    [Salt] VARCHAR(MAX) NULL DEFAULT null
)
