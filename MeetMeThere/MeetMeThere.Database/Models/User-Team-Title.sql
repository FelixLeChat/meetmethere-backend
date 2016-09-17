CREATE TABLE [dbo].[User-Team-Title]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [UserId] INT NULL, 
    [TeamId] INT NULL, 
    [Title] VARCHAR(MAX) NULL, 
    CONSTRAINT [FK_User-Team-Title_User] FOREIGN KEY (UserId) REFERENCES "User"(Id), 
    CONSTRAINT [FK_User-Team-Title_Team] FOREIGN KEY (TeamId) REFERENCES Team(Id)
)
